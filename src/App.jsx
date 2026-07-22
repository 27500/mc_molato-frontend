import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import Artisans from './pages/Artisans';
import Cart from './pages/Cart';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  
  // Calcul du nombre total d'articles dans le panier
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200">
        
        {/* ================= HEADER ================= */}
        <header className="max-w-[1400px] mx-auto px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            
            {/* Gauche : Logo & Menu Burger mobile */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden text-2xl text-gray-800 focus:outline-none"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>

              <Link to="/">
                <img src="/logo.jpeg" alt="Mc molato logo" className="h-16 md:h-20 object-contain" />
              </Link>
            </div>

            {/* Barre de recherche (Desktop) */}
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-72 shadow-sm">
              <span className="text-gray-400 text-sm mr-2">🔍</span>
              <input 
                type="text" 
                placeholder="Rechercher des styles..." 
                className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Navigation Centrale (Desktop) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-black transition">Accueil</Link>
              <Link to="/boutique" className="hover:text-black transition">Boutique de tissus</Link>
              <Link to="/collections" className="hover:text-black transition">Collections</Link>
              <Link to="/about" className="hover:text-black transition">À propos</Link>
              <Link to="/artisans" className="hover:text-black transition">Nos artisans</Link>
            </nav>

            {/* Droite : Icônes interactives */}
            <div className="flex items-center gap-5 text-gray-700">
              <button className="hover:text-black transition text-lg" title="Favoris">♡</button>
              <button className="hover:text-black transition text-lg" title="Compte">👤</button>
              
              <Link to="/panier" className="hover:text-black transition text-lg relative" title="Panier">
                🛍️
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Barre de recherche Mobile */}
          <div className="mt-3 lg:hidden flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-full shadow-sm">
            <span className="text-gray-400 text-sm mr-2">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher des styles..." 
              className="bg-transparent text-sm outline-none w-full text-gray-800 placeholder-gray-400"
            />
          </div>
        </header>

        {/* Menu mobile déroulant avec liens actifs */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 shadow-lg">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold">Accueil</Link>
            <Link to="/boutique" onClick={() => setMobileMenuOpen(false)} className="text-gray-600">Boutique de tissus</Link>
            <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="text-gray-600">Collections</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-600">À propos</Link>
            <Link to="/artisans" onClick={() => setMobileMenuOpen(false)} className="text-gray-600">Nos artisans</Link>
          </div>
        )}

        {/* ================= CONTENU DES ROUTES ================= */}
        <main className="max-w-[1400px] mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/panier" element={<Cart />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}