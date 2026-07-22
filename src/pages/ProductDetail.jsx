import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  // On récupère l'ID du produit depuis l'adresse URL
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('M');
  const [isCustomOrder, setIsCustomOrder] = useState(false);

  // Simulation d'un vêtement complet
  const product = {
    id: id || 1,
    title: "Veste Royale Bogolan",
    category: "Stylisme & Collection",
    price: "180",
    description: "Cette veste structurée est réalisée à partir d'un véritable tissu Bogolan malien, tissé et teint à la main avec des teintures naturelles (argile, feuilles de bouleau). Chaque motif a une signification symbolique protectrice.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
    sizes: ['S', 'M', 'L', 'XL', 'Sur-mesure'],
    details: [
      "100% Coton bio tissé à la main (Mali)",
      "Doublure intérieure en soie douce",
      "Boutons artisanaux en corne",
      "Nettoyage à sec recommandé uniquement"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Bouton retour */}
      <Link to="/boutique" className="inline-flex items-center text-sm font-medium text-terracotta hover:underline mb-8">
        ← Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Photo principale du produit */}
        <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Informations, choix de taille et commande */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-terracotta font-bold">{product.category}</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ebony mt-1 mb-4">{product.title}</h1>
          <p className="text-2xl font-bold text-ebony mb-6">{product.price} €</p>
          
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Choix des tailles */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-ebony">Sélectionnez votre taille :</label>
              <button 
                onClick={() => setIsCustomOrder(!isCustomOrder)}
                className="text-xs text-terracotta underline font-medium"
              >
                {isCustomOrder ? "Choisir une taille standard" : "Besoin d'un ajustement sur-mesure ?"}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); if(size === 'Sur-mesure') setIsCustomOrder(true); }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-lg font-medium text-sm flex items-center justify-center transition-all ${
                    selectedSize === size
                      ? 'bg-ebony text-white shadow-md'
                      : 'bg-white text-ebony border border-gray-300 hover:border-terracotta'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Encadré spécial "Stylisme Sur-mesure" si l'option est activée */}
          {isCustomOrder && (
            <div className="bg-sand p-5 rounded-xl border border-terracotta mb-8">
              <h4 className="font-serif font-bold text-terracotta mb-1"> ✨ Atelier Sur-Mesure</h4>
              <p className="text-xs text-gray-700 mb-3">
                En choisissant le sur-mesure, notre styliste vous contactera par WhatsApp ou e-mail après la commande pour prendre vos mensurations exactes (tour de poitrine, longueur de manche, épaule).
              </p>
            </div>
          )}

          {/* Boutons d'action E-commerce */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button className="w-full bg-terracotta text-white py-4 rounded-xl font-bold hover:bg-terracotta/90 transition-colors shadow-lg text-center">
              {isCustomOrder ? "Commander en Sur-Mesure" : "Ajouter au Panier"}
            </button>
            <button className="w-full sm:w-auto px-6 py-4 border border-ebony text-ebony rounded-xl font-bold hover:bg-ebony hover:text-white transition-colors text-center">
              💖 Coup de cœur
            </button>
          </div>

          {/* Fiche Technique du tissu */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ebony mb-4">Détails & Artisanat</h3>
            <ul className="space-y-2">
              {product.details.map((detail, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-waxgold rounded-full inline-block"></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}