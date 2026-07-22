import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-sand border-b border-terracotta/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Titre du site qui ramène à l'accueil */}
          <Link to="/" className="text-xl md:text-2xl font-serif font-bold text-ebony">
            AFRI<span className="text-terracotta">STYL</span>
          </Link>

          {/* Liens de navigation */}
          <div className="flex space-x-6 md:space-x-8 text-sm md:text-base font-medium">
            <Link to="/" className="text-ebony hover:text-terracotta transition-colors">
              Accueil
            </Link>
            <Link to="/boutique" className="text-ebony hover:text-terracotta transition-colors">
              Boutique
            </Link>
            <Link to="/lookbook" className="text-ebony hover:text-terracotta transition-colors">
              Lookbook
            </Link>
          </div>

          {/* Panier / Actions rapide */}
          <div className="flex items-center space-x-4">
            <Link to="/panier" className="bg-ebony text-sand px-3 py-1.5 rounded-lg text-xs md:text-sm hover:bg-terracotta transition-colors">
              Panier (0)
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}