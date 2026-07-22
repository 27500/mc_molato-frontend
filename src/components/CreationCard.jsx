import React from 'react';

// Note : J'ai ajouté "id" dans les paramètres (props)
export default function CreationCard({ id, title, category, price, imageUrl, isCustomizable }) {
  return (
    <div className="group flex flex-col bg-sand rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-900/10">
      
      {/* Conteneur Image avec ratio portrait adapté à la mode */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badge "Sur-mesure disponible" pour le côté Stylisme */}
        {isCustomizable && (
          <span className="absolute top-3 left-3 bg-ebony/80 text-waxgold text-xs uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
            Sur-mesure
          </span>
        )}
      </div>

      {/* Détails et Actions */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-terracotta font-semibold mb-1">
            {category}
          </p>
          <h3 className="text-lg md:text-xl font-serif font-bold text-ebony group-hover:text-terracotta transition-colors">
            {title}
          </h3>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-ebony">
            {price} €
          </span>
          
          <div className="flex gap-2">
            {/* Bouton Stylisme / Détails du look */}
            <button className="px-3 py-2 text-xs md:text-sm font-medium text-ebony border border-ebony rounded-lg hover:bg-ebony hover:text-white transition-colors">
              Le Look
            </button>
            {/* Bouton E-commerce direct */}
            <button className="px-3 py-2 text-xs md:text-sm font-medium bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors shadow-sm">
              Ajouter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}