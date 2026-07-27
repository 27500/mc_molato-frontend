import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="py-16 px-4 max-w-[1200px] mx-auto text-center">
        <h1 className="text-4xl font-serif font-light mb-6">Vos Favoris</h1>
        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 max-w-lg mx-auto flex flex-col items-center gap-4 shadow-sm">
          <span className="text-5xl">♡</span>
          <p className="text-gray-600 font-light">Vous n'avez aucun article dans vos favoris pour le moment.</p>
          <Link to="/boutique" className="bg-black text-white text-xs tracking-wider uppercase px-6 py-3.5 rounded-full font-medium transition hover:bg-zinc-800 shadow-md">
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto text-gray-900">
      <h1 className="text-4xl font-serif font-light mb-8">Vos Favoris ({favorites.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((product) => (
          <div key={product.id} className="group flex flex-col gap-3">
            <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 h-[350px]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <button 
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full text-red-500 shadow-sm hover:scale-110 transition"
              >
                ❤️
              </button>
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