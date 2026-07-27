import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();

const initialProducts = [
  // Tu peux mettre tes produits initiaux ici ou laisser vide si géré ailleurs
];

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('mc_molato_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('mc_molato_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => [ { ...product, id: Date.now() }, ...prev ]);
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}