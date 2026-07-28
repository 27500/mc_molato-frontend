import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const initialProducts = [
  { 
    id: 1, 
    name: 'Boubou Royal Tissé Main', 
    category: 'homme', 
    priceFormatted: '120.000 CDF', 
    rawPrice: 120000, 
    image: '/homme.jpeg', 
    images: ['/homme.jpeg', '/style.jpeg'],
    description: 'Magnifique boubou traditionnel tissé à la main, idéal pour les grandes cérémonies.'
  },
  { 
    id: 2, 
    name: 'Ensemble Élégance Africaine', 
    category: 'femme', 
    priceFormatted: '135.000 CDF', 
    rawPrice: 135000, 
    image: '/femme.jpeg', 
    images: ['/femme.jpeg', '/mode.jpeg'],
    description: 'Ensemble féminin moderne aux motifs riches et authentiques.'
  },
  { 
    id: 3, 
    name: 'Chemise Traditionnelle Moderne', 
    category: 'homme', 
    priceFormatted: '85.000 CDF', 
    rawPrice: 85000, 
    image: '/style.jpeg', 
    images: ['/style.jpeg'],
    description: 'Chemise élégante alliant tradition et coupes contemporaines.'
  },
  { 
    id: 4, 
    name: 'Robe de Cérémonie Bogolan', 
    category: 'femme', 
    priceFormatted: '175.000 CDF', 
    rawPrice: 175000, 
    image: '/mode.jpeg', 
    images: ['/mode.jpeg'],
    description: 'Robe digne de royauté inspirée des motifs traditionnels Bogolan.'
  },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [sortOrder, setSortOrder] = useState('default'); // Ajout de l'état pour le tri par prix
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  // Fonction de chargement des produits (statiques + localStorage)
  const loadProducts = () => {
    const customProducts = JSON.parse(localStorage.getItem('mc_molato_custom_products') || '[]');
    setProducts([...customProducts, ...initialProducts]);
  };

  useEffect(() => {
    loadProducts();

    // Écouteur pour actualiser la boutique en temps réel lors de l'ajout d'un article depuis l'Admin
    window.addEventListener('custom_products_updated', loadProducts);
    return () => {
      window.removeEventListener('custom_products_updated', loadProducts);
    };
  }, []);

  // --- FILTRAGE STRICT & TRI ---
  const filteredProducts = products.filter(p => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    if (selectedCategory === 'tous') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  }).sort((a, b) => {
    if (sortOrder === 'asc') return (a.rawPrice || 0) - (b.rawPrice || 0);
    if (sortOrder === 'desc') return (b.rawPrice || 0) - (a.rawPrice || 0);
    return 0;
  });

  return (
    <div className="py-8 max-w-[1400px] mx-auto px-4">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-light mb-3">Boutique de Tissus & Styles</h1>
        <p className="text-xs md:text-sm text-gray-500">
          {searchQuery ? `Résultats exclusifs pour : "${searchQuery}"` : "Découvrez nos créations exclusives façonnées avec passion par les artisans."}
        </p>
      </div>

      {/* Affichage des catégories uniquement si on ne fait pas de recherche */}
      {!searchQuery && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex justify-center gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            {['tous', 'homme', 'femme', 'unisexe'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                  selectedCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'tous' ? 'Tous les styles' : cat}
              </button>
            ))}
          </div>

          {/* Bouton de tri par prix (select) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-100 border border-gray-200 text-gray-700 text-xs rounded-full px-4 py-2.5 outline-none focus:border-black transition cursor-pointer"
            >
              <option value="default">Trier par : Pertinence</option>
              <option value="asc">Prix : Croissant</option>
              <option value="desc">Prix : Décroissant</option>
            </select>
          </div>
        </div>
      )}

      {/* Gestion si aucun résultat de recherche */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-4 font-medium">Aucun article ne correspond à "{searchQuery}".</p>
          <Link to="/boutique" className="inline-block bg-black text-white text-xs px-6 py-3 rounded-xl uppercase tracking-wider hover:bg-zinc-800 transition">
            Voir toute la boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFav = favorites.some(fav => fav.id === product.id);
            return (
              <div key={product.id} className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition relative group">
                
                <button 
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-7 right-7 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-sm shadow-sm hover:scale-110 transition"
                >
                  {isFav ? '❤️' : '🤍'}
                </button>

                <div 
                  onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 mb-4 cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = '/logo.jpeg'; }}
                  />
                  {product.images && product.images.length > 1 && (
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-medium">
                      +{product.images.length - 1} photos
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block mb-1">
                    {product.category}
                  </span>
                  <h3 
                    onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
                    className="font-serif text-sm font-medium text-gray-900 mb-2 truncate cursor-pointer hover:underline"
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs font-bold text-black">
                      {product.priceFormatted || `${product.rawPrice?.toLocaleString()} CDF`}
                    </p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-black text-white text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-zinc-800 transition"
                    >
                      Ajouter 🛍️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale de détails du produit */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-3">
                  <img 
                    src={selectedProduct.images?.[currentImageIndex] || selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/logo.jpeg'; }}
                  />
                </div>

                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${currentImageIndex === idx ? 'border-black' : 'border-transparent opacity-60'}`}
                      >
                        <img src={img} alt="miniature" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block mb-1">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-xl font-serif font-medium text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm font-bold text-black mb-4">
                    {selectedProduct.priceFormatted || `${selectedProduct.rawPrice?.toLocaleString()} CDF`}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {selectedProduct.description || "Aucune description détaillée fournie pour cet article."}
                  </p>
                </div>

                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-black text-white py-3.5 rounded-xl text-xs uppercase tracking-wider font-medium hover:bg-zinc-800 transition"
                >
                  Ajouter au panier 🛍️
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}