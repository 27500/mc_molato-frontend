import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useFavorites } from './context/FavoritesContext';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import Artisans from './pages/Artisans';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Account from './pages/Account';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminMessages from './components/AdminMessages';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-2xl text-gray-800">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            <Link to="/" className="flex items-center">
              <img src="/logo.jpeg" alt="Mc molato logo" className="max-h-12 sm:max-h-16 w-auto object-contain" />
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm focus-within:border-black transition w-36 sm:w-64 lg:w-72">
            <span className="text-gray-400 text-xs sm:text-sm mr-1.5 sm:mr-2">🔍</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..." 
              className="bg-transparent text-xs sm:text-sm outline-none w-full text-gray-800"
            />
          </form>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-black transition">Accueil</Link>
            <Link to="/boutique" className="hover:text-black transition">Boutique</Link>
            <Link to="/about" className="hover:text-black transition">À propos</Link>
            <Link to="/artisans" className="hover:text-black transition">Artisans</Link>
            <Link to="/contact" className="hover:text-black transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 text-gray-700">
            <Link to="/favoris" className="hover:text-black transition text-sm sm:text-lg relative flex items-center bg-gray-100 hover:bg-gray-200 px-2.5 sm:px-3 py-1.5 rounded-full">
              <span>♡</span>
              {favorites.length > 0 && <span className="ml-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{favorites.length}</span>}
            </Link>
            <Link to="/compte" className="hover:text-black transition text-sm sm:text-lg bg-gray-100 hover:bg-gray-200 p-2 rounded-full">👤</Link>
            <Link to="/panier" className="hover:text-black transition text-sm sm:text-lg relative flex items-center bg-gray-100 hover:bg-gray-200 px-2.5 sm:px-3 py-1.5 rounded-full">
              <span>🛍️</span>
              {totalItems > 0 && <span className="ml-1.5 sm:ml-2 bg-black text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[81px] left-0 w-full bg-white border-b border-gray-100 px-6 py-6 flex flex-col gap-4 shadow-xl z-40">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-sm">Accueil</Link>
          <Link to="/boutique" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">Boutique</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">À propos</Link>
          <Link to="/artisans" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">Artisans</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">Contact</Link>
          <Link to="/favoris" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">Mes Favoris</Link>
          <Link to="/compte" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 text-sm">Mon Compte</Link>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-6 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-xs text-gray-500 font-medium">
          Vous pouvez nous trouver sur ces réseaux sociaux :
        </p>
        <div className="flex items-center gap-5">
          {/* Instagram */}
          <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="text-gray-700 hover:text-black transition hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          {/* TikTok */}
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok" className="text-gray-700 hover:text-black transition hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </a>
          {/* WhatsApp */}
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" title="WhatsApp" className="text-gray-700 hover:text-black transition hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </a>
          {/* Snapchat */}
          <a href="https://snapchat.com" target="_blank" rel="noreferrer" title="Snapchat" className="text-gray-700 hover:text-black transition hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 2C7.307 2 3.5 5.817 3.5 10.527c0 4.015 2.766 7.378 6.471 8.243-.284-.66-.475-1.416-.541-2.257-.074-.94-.035-1.79.13-2.502-.279-.313-.483-.807-.584-1.393-.11-.645-.04-1.298.196-1.841-.301-.974-.241-2.152.196-3.238.653-.083 1.662.333 2.508 1.134.825-.795 1.82-1.21 2.464-1.132.445 1.082.504 2.261.201 3.235.24.545.312 1.201.201 1.847-.1.589-.306 1.085-.588 1.4-.16.717-.122 1.571-.148 2.515-.067.846-.26 1.607-.547 2.271 3.732-.857 6.523-4.229 6.523-8.254C20.534 5.817 16.727 2 12.017 2z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200 flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="max-w-[1400px] mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/boutique" element={<Shop />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/artisans" element={<Artisans />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/favoris" element={<Favorites />} />
              <Route path="/compte" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/secure-portal-mc-molato-998877" element={<Admin />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}