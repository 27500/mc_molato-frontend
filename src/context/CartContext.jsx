import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Fonction utilitaire pour obtenir la clé localStorage propre à l'utilisateur actuel
  const getLocalStorageKey = () => {
    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) return null;
    try {
      const user = JSON.parse(savedUser);
      return user?.email ? `mc_molato_cart_${user.email}` : null;
    } catch (e) {
      return null;
    }
  };

  // 1. Initialiser le panier immédiatement depuis le localStorage pour éviter qu'il ne se vide au refresh
  const [cart, setCart] = useState(() => {
    const storageKey = getLocalStorageKey();
    if (!storageKey) return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Charger et synchroniser le panier depuis le Backend au montage
  useEffect(() => {
    const fetchUserCart = async () => {
      const savedUser = localStorage.getItem('mc_molato_user');
      if (!savedUser) {
        setCart([]); 
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        const storageKey = `mc_molato_cart_${user.email}`;

        // Charger d'abord du local pour un affichage instantané
        const localCart = localStorage.getItem(storageKey);
        if (localCart) {
          setCart(JSON.parse(localCart));
        }

        const response = await fetch(`${API_URL}/users/get-cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await response.json();
        
        if (response.ok && data.cart) {
          setCart((prevCart) => {
            const combined = [...data.cart];
            
            // Fusionner avec le panier local pour ne rien perdre (notamment les articles custom)
            prevCart.forEach(localItem => {
              if (!combined.some(item => String(item.id) === String(localItem.id))) {
                combined.push(localItem);
              }
            });

            try {
              localStorage.setItem(storageKey, JSON.stringify(combined));
            } catch (e) {
              console.error("Erreur d'enregistrement local du panier :", e);
            }
            return combined;
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };

    fetchUserCart();

    const handleStorageChange = () => {
      fetchUserCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fonction utilitaire pour synchroniser avec le backend et le localStorage
  const saveAndSyncCart = async (updatedCart) => {
    setCart(updatedCart);

    const storageKey = getLocalStorageKey();
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedCart));
      } catch (e) {
        console.error("LocalStorage plein ou bloqué pour le panier :", e);
      }
    }

    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) return;

    try {
      const user = JSON.parse(savedUser);
      await fetch(`${API_URL}/users/update-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, cart: updatedCart })
      });
    } catch (error) {
      console.error("Erreur lors de la synchronisation du panier avec le serveur :", error);
    }
  };

  const addToCart = (product) => {
    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) {
      alert("Veuillez vous connecter pour ajouter des articles au panier.");
      return;
    }

    let numericPrice = 0;
    if (typeof product.rawPrice === 'number' && !isNaN(product.rawPrice)) {
      numericPrice = product.rawPrice;
    } else if (product.priceFormatted) {
      numericPrice = parseInt(product.priceFormatted.replace(/[^0-9]/g, ''), 10) || 0;
    }

    // Nettoyer l'article pour éviter les bugs d'images ou de données corrompues
    const cleanProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      priceFormatted: product.priceFormatted,
      rawPrice: numericPrice,
      image: product.image,
      images: product.images,
      description: product.description
    };

    const existingItem = cart.find((item) => String(item.id) === String(cleanProduct.id));
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        String(item.id) === String(cleanProduct.id) 
          ? { ...item, quantity: item.quantity + 1, rawPrice: numericPrice } 
          : item
      );
    } else {
      updatedCart = [...cart, { ...cleanProduct, quantity: 1 }];
    }

    saveAndSyncCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => String(item.id) !== String(id));
    saveAndSyncCart(updatedCart);
  };

  const updateQuantity = (id, quantity) => {
    let updatedCart;
    if (quantity <= 0) {
      updatedCart = cart.filter((item) => String(item.id) !== String(id));
    } else {
      updatedCart = cart.map((item) => (String(item.id) === String(id) ? { ...item, quantity } : item));
    }
    saveAndSyncCart(updatedCart);
  };

  const clearCart = () => {
    saveAndSyncCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}