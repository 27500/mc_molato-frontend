import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  // État pour gérer le retour visuel "Ajouté ! ✅" sur le panier
  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    addToCart(product);
    setAddingId(productId);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  // Fonction infaillible pour retrouver la vraie image de l'article (classique ou personnalisé)
  const getProductImage = (product) => {
    // 1. Si le produit a déjà une image valide sous forme de chaîne
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '' && !product.image.includes('logo')) {
      return product.image;
    }

    // 2. Si l'article a un tableau d'images
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }

    // 3. Chercher dans les articles personnalisés enregistrés localement
    try {
      const customProducts = JSON.parse(localStorage.getItem('mc_molato_custom_products') || '[]');
      const foundCustom = customProducts.find(p => String(p.id) === String(product.id));
      if (foundCustom) {
        if (foundCustom.image && typeof foundCustom.image === 'string') return foundCustom.image;
        if (Array.isArray(foundCustom.images) && foundCustom.images.length > 0) return foundCustom.images[0];
      }
    } catch (e) {
      console.error("Erreur recherche custom:", e);
    }

    // 4. Dernier recours : si l'objet a une image quelconque stockée
    if (product.image) return product.image;

    return '/logo.jpeg';
  };

  if (!favorites || favorites.length === 0) {
    return (
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="py-16 px-4 max-w-[1200px] mx-auto text-center text-gray-900">
          <h1 className="text-4xl font-serif font-light mb-6">Vos Favoris</h1>
          <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-12 max-w-lg mx-auto flex flex-col items-center gap-4 shadow-sm">
            <span className="text-5xl">♡</span>
            <p className="text-gray-600 font-light">Vous n'avez aucun article dans vos favoris pour le moment.</p>
            <Link to="/boutique" className="bg-black text-white text-xs tracking-wider uppercase px-6 py-3.5 rounded-full font-medium transition hover:bg-zinc-800 shadow-md">
              Explorer la boutique
            </Link>
          </div>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto text-gray-900">
      
      {/* Titre de la page */}
      <ScrollReveal animation="fade-up" delay={100}>
        <h1 className="text-4xl font-serif font-light mb-8">Vos Favoris ({favorites.length})</h1>
      </ScrollReveal>

      {/* Grille des favoris */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((product, index) => {
          const displayImage = getProductImage(product);
          const productId = product._id || product.id || index;
          const isJustAdded = addingId === productId;

          return (
            <ScrollReveal key={productId} animation="fade-up" delay={150 + (index % 3) * 50}>
              <div className="group flex flex-col gap-3">
                <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 h-[350px]">
                  <img 
                    src={displayImage} 
                    alt={product.name || 'Article'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo.jpeg';
                    }}
                  />
                  <button 
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full text-red-500 shadow-sm hover:scale-110 transition"
                    title="Retirer des favoris"
                  >
                    ❤️
                  </button>
                </div>
                
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500 font-light">
                      {product.priceFormatted || (product.rawPrice ? `${product.rawPrice.toLocaleString()} $` : '')}
                    </p>
                  </div>
                  
                  {/* Bouton Panier avec protection anti-clics multiples */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={isJustAdded}
                    className={`text-xs tracking-wider uppercase px-4 py-2.5 rounded-full font-medium transition shadow-sm ${
                      isJustAdded 
                        ? 'bg-green-600 text-white font-semibold' 
                        : 'bg-black hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {isJustAdded ? 'Ajouté ! ✅' : 'Ajouter 🛍️'}
                  </button>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}