import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      
      {/* ================= LIGNE DU HAUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Grand bloc principal à gauche */}
        <div className="lg:col-span-2 relative rounded-[2.5rem] overflow-hidden bg-gray-900 min-h-[420px] md:min-h-[480px] flex items-center p-8 md:p-12 shadow-sm">
          <img 
            src="/couple.jpeg"
            alt="Hero African Fashion" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          <div className="relative z-10 max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-4">
              Célébrez l'héritage africain dans chaque fil
            </h1>
            <p className="text-gray-200 text-xs md:text-sm font-light mb-8 max-w-sm">
              Tissé à la main par des artisans locaux avec des générations de talent et de passion.
            </p>
            <Link to="/boutique" className="inline-block bg-black hover:bg-zinc-800 text-white text-xs tracking-wider uppercase px-6 py-3.5 rounded-full font-medium transition shadow-md">
              VOIR LES COLLECTIONS
            </Link>
          </div>
        </div>

        {/* Colonne de droite : Blocs "Femme" et "Homme" */}
        <div className="flex flex-col gap-5">
          
          <Link to="/boutique?category=femme" className="relative rounded-[2rem] overflow-hidden bg-gray-100 h-[225px] group block">
            <img 
              src="/femme.jpeg" 
              alt="Collection Femme" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
              Femme ↗
            </div>
          </Link>

          <Link to="/boutique?category=homme" className="relative rounded-[2rem] overflow-hidden bg-gray-100 h-[225px] group block">
            <img 
              src="/homme.jpeg" 
              alt="Collection Homme" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
              Homme ↗
            </div>
          </Link>

        </div>

      </div>{/* Fin de la grille du haut */}

      {/* ================= LIGNE DU BAS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Carte 1 */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gray-200 h-[280px] p-6 flex flex-col justify-end group">
          <img 
            src="/mode.jpeg" 
            alt="Créez votre style" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex justify-between items-end">
            <span className="text-white text-xl font-medium leading-snug">
              Créez votre<br />propre style
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              ↗
            </div>
          </div>
        </div>

        {/* Carte 2 */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gray-200 h-[280px] p-6 flex flex-col justify-end group">
          <img 
            src="/style.jpeg" 
            alt="Fait main" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex justify-between items-end">
            <span className="text-white text-lg font-medium leading-snug max-w-[200px]">
              Fait main avec des techniques traditionnelles
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              ↗
            </div>
          </div>
        </div>

        {/* Carte 3 */}
        <div className="bg-[#f7f7f7] border border-gray-200/80 rounded-[2rem] p-8 flex flex-col justify-between h-[280px]">
          <div>
            <h2 className="text-3xl font-serif text-gray-900 mb-3">Portez la tradition</h2>
            <p className="text-gray-500 text-xs leading-relaxed font-light">
              Des tissus africains authentiques, sourcés de manière éthique et pensés pour les styles modernes.
            </p>
          </div>
          <div>
            <Link to="/boutique" className="inline-block border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-medium tracking-wider uppercase px-6 py-3 rounded-full transition">
              DÉCOUVRIR LES INSPIRATIONS
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}