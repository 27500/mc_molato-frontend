import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'tous';
  const { addToCart } = useCart();

  // Produits avec des prix en Francs Congolais (CDF) et une valeur numérique pour le calcul
  const allProducts = [
    { id: 1, name: 'Boubou Royal Tissé Main', category: 'homme', priceFormatted: '120.000 CDF', priceValue: 120000, image: '/homme.jpeg' },
    { id: 2, name: 'Ensemble Élégance Africaine', category: 'femme', priceFormatted: '135.000 CDF', priceValue: 135000, image: '/femme.jpeg' },
    { id: 3, name: 'Chemise Traditionnelle Moderne', category: 'homme', priceFormatted: '85.000 CDF', priceValue: 85000, image: '/style.jpeg' },
    { id: 4, name: 'Robe de Cérémonie Bogolan', category: 'femme', priceFormatted: '175.000 CDF', priceValue: 175000, image: '/mode.jpeg' },
    { id: 5, name: 'Veste Stylée & Ethnique', category: 'homme', priceFormatted: '110.000 CDF', priceValue: 110000, image: '/homme.jpeg' },
    { id: 6, name: 'Pagne d’Exception Tissé', category: 'femme', priceFormatted: '95.000 CDF', priceValue: 95000, image: '/femme.jpeg' },
  ];

  const filteredProducts = currentCategory === 'tous' 
    ? allProducts 
    : allProducts.filter(p => p.category === currentCategory);

  const handleFilterChange = (category) => {
    if (category === 'tous') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto text-gray-900">
      
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-light mb-3">Boutique de Tissus & Vêtements</h1>
        <p className="text-gray-600 font-light text-sm max-w-xl">
          Explorez notre sélection authentique. Cliquez sur "Ajouter au panier" pour commander vos pièces favorites.
        </p>
      </div>

      {/* Boutons de filtre */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-100 pb-6">
        <button 
          onClick={() => handleFilterChange('tous')}
          className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition ${
            currentCategory === 'tous' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tous les articles
        </button>
        <button 
          onClick={() => handleFilterChange('femme')}
          className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition ${
            currentCategory === 'femme' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Collection Femme
        </button>
        <button 
          onClick={() => handleFilterChange('homme')}
          className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition ${
            currentCategory === 'homme' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Collection Homme
        </button>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group flex flex-col gap-3">
            <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 h-[350px]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-900 shadow-sm">
                {product.category}
              </span>
            </div>
            
            <div className="flex justify-between items-start px-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500 font-light">{product.priceFormatted}</p>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="bg-black hover:bg-zinc-800 text-white text-xs tracking-wider uppercase px-4 py-2.5 rounded-full font-medium transition shadow-sm"
              >
                Ajouter 🛍️
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}