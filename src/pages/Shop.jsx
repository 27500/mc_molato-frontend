import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { API_URL } from '../services/api';
import ScrollReveal from '../components/ScrollReveal';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [sortOrder, setSortOrder] = useState('default');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // État pour gérer l'effet "Ajouté !" sur les boutons d'achat
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  // 📌 Chargement des produits depuis le Backend en ligne
  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setProducts(data);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits depuis l'API :", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    const productId = product._id || product.id;
    addToCart(product);
    setAddingId(productId);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const filteredProducts = products.filter(p => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    if (selectedCategory === 'tous') return true;
    return p.category && p.category.toLowerCase() === selectedCategory.toLowerCase();
  }).sort((a, b) => {
    if (sortOrder === 'asc') return (a.rawPrice || a.price || 0) - (b.rawPrice || b.price || 0);
    if (sortOrder === 'desc') return (b.rawPrice || b.price || 0) - (a.rawPrice || a.price || 0);
    return 0;
  });

  return (
    <div className="py-8 max-w-[1400px] mx-auto px-4">
      
      {/* En-tête de la boutique */}
      <ScrollReveal animation="fade-up" delay={100}>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-light mb-3">Boutique de Tissus & Styles</h1>
          <p className="text-xs md:text-sm text-gray-500">
            {searchQuery ? `Résultats exclusifs pour : "${searchQuery}"` : "Découvrez nos créations exclusives façonnées avec passion par les artisans."}
          </p>
        </div>
      </ScrollReveal>

      {/* Filtres et Tri */}
      {!searchQuery && (
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="flex justify-center gap-3 overflow-x-auto pb-2 w-full md:w-auto">
              {['tous', 'homme', 'femme', 'enfant', 'unisexe'].map((cat) => (
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
        </ScrollReveal>
      )}

      {/* Grille de produits */}
      {filteredProducts.length === 0 ? (
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-4 font-medium">
              {searchQuery ? `Aucun article ne correspond à "${searchQuery}".` : "Aucun article disponible pour le moment."}
            </p>
            {searchQuery && (
              <Link to="/boutique" className="inline-block bg-black text-white text-xs px-6 py-3 rounded-xl uppercase tracking-wider hover:bg-zinc-800 transition">
                Voir toute la boutique
              </Link>
            )}
          </div>
        </ScrollReveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => {
            const productId = product._id || product.id;
            const isFav = favorites.some(fav => String(fav._id || fav.id) === String(productId));
            const isJustAdded = addingId === productId;

            return (
              <ScrollReveal key={productId} animation="fade-up" delay={100 + (index % 4) * 50}>
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition relative group h-full">
                  
                  {/* Bouton Favori avec vérification robuste par ID */}
                  <button 
                    onClick={() => toggleFavorite(product)}
                    className={`absolute top-7 right-7 z-10 backdrop-blur-md p-2 rounded-full text-sm shadow-sm hover:scale-110 transition ${
                      isFav ? 'bg-red-50 text-red-500 scale-105' : 'bg-white/80 text-gray-700'
                    }`}
                    title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
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
                        {product.priceFormatted || `${(product.rawPrice || product.price)?.toLocaleString()} $`}
                      </p>
                      
                      {/* Bouton Panier */}
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={isJustAdded}
                        className={`text-[10px] uppercase tracking-wider px-3 py-2 rounded-xl transition ${
                          isJustAdded 
                            ? 'bg-green-600 text-white font-semibold' 
                            : 'bg-black text-white hover:bg-zinc-800'
                        }`}
                      >
                        {isJustAdded ? 'Ajouté ! ✅' : 'Ajouter 🛍️'}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Modale de détails du produit */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
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
                    {selectedProduct.priceFormatted || `${(selectedProduct.rawPrice || selectedProduct.price)?.toLocaleString()} $`}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    {selectedProduct.description || "Aucune description détaillée fournie pour cet article."}
                  </p>
                </div>

                <button 
                  onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
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