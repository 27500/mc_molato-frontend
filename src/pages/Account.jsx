import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { API_URL } from '../services/api';
import ScrollReveal from '../components/ScrollReveal';

export default function Account() {
  const [step, setStep] = useState('loading'); // 'login', 'register', 'dashboard'
  
  // États du formulaire d'inscription
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // États pour la connexion par e-mail et mot de passe
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { cart } = useCart();
  const { favorites } = useFavorites();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const savedUser = localStorage.getItem('mc_molato_user');
    const isLogged = localStorage.getItem('mc_molato_logged');

    if (savedUser && isLogged === 'true') {
      setUser(JSON.parse(savedUser));
      setStep('dashboard');
    } else {
      setStep('login');
    }
  }, []);

  // Inscription sécurisée connectée au Backend
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      const newUser = { name: data.name, email: data.email, phone: phone || '' };
      localStorage.setItem('mc_molato_user', JSON.stringify(newUser));
      localStorage.setItem('mc_molato_logged', 'true');
      setUser(newUser);
      setStep('dashboard');
      setMessage('');
      window.location.reload();
    } catch (error) {
      setMessage("Erreur de connexion avec le serveur backend.");
    } finally {
      setLoading(false);
    }
  };

  // Connexion sécurisée par Email et Mot de passe
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setMessage('Veuillez entrer votre e-mail et votre mot de passe.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || 'E-mail ou mot de passe incorrect.');
        setLoading(false);
        return;
      }

      localStorage.setItem('mc_molato_user', JSON.stringify(data.user));
      localStorage.setItem('mc_molato_logged', 'true');
      setUser(data.user);
      setStep('dashboard');
      setMessage('');
      window.location.reload();
    } catch (error) {
      setMessage("Erreur de connexion avec le serveur backend.");
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('mc_molato_logged');
    localStorage.removeItem('mc_molato_user');
    setUser(null);
    setStep('login');
    window.location.reload();
  };

  if (step === 'loading') {
    return <div className="py-20 text-center text-gray-500 text-sm">Chargement de votre espace...</div>;
  }

  return (
    <div className="py-12 px-4 max-w-lg mx-auto text-gray-900">
      
      {/* Logo */}
      <ScrollReveal animation="fade-down" delay={100}>
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <img 
              src="/logo.jpeg" 
              alt="Mc Molato Logo" 
              className="w-16 h-16 object-cover rounded-2xl shadow-md border border-gray-100 hover:opacity-90 transition"
            />
          </Link>
        </div>
      </ScrollReveal>

      {/* 1. CONNEXION (PAR EMAIL & MOT DE PASSE) */}
      {step === 'login' && (
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
            <h1 className="text-2xl font-serif font-light mb-2 text-center">Connexion Sécurisée</h1>
            <p className="text-xs text-gray-500 text-center mb-6">Entrez vos identifiants pour accéder à votre compte.</p>

            {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
            
            <div className="mt-6 text-center border-t border-gray-200/60 pt-4 text-xs">
              <span className="text-gray-400">Pas encore de compte ? </span>
              <button 
                onClick={() => { setStep('register'); setMessage(''); }}
                className="font-medium text-black underline hover:text-gray-700 transition ml-1 cursor-pointer"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 2. INSCRIPTION */}
      {step === 'register' && (
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
            <h1 className="text-2xl font-serif font-light mb-2 text-center">Créer un compte</h1>
            <p className="text-xs text-gray-500 text-center mb-6">Rejoignez Mc Molato pour suivre vos commandes et favoris en toute sécurité.</p>

            {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Blessing Mingenge"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choisissez un mot de passe sécurisé"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Numéro de téléphone (optionnel)</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+243 ..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Création..." : "S'inscrire"}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-200/60 pt-4 text-xs">
              <span className="text-gray-400">Déjà un compte ? </span>
              <button 
                onClick={() => { setStep('login'); setMessage(''); }} 
                className="font-medium text-black underline hover:text-gray-700 transition ml-1 cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* 3. DASHBOARD */}
      {step === 'dashboard' && user && (
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black text-white text-2xl font-serif rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h1 className="text-2xl font-serif font-medium">{user.name}</h1>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                Client VIP Mc Molato ✓
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Link 
                to="/favoris"
                className="bg-white border border-gray-200/80 p-4 rounded-2xl text-center hover:border-black transition group shadow-sm flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition">❤️</span>
                <span className="text-xs font-medium text-gray-800">Voir mes favoris</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{favorites.length} article(s)</span>
              </Link>

              <Link 
                to="/panier"
                className="bg-white border border-gray-200/80 p-4 rounded-2xl text-center hover:border-black transition group shadow-sm flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition">🛍️</span>
                <span className="text-xs font-medium text-gray-800">Voir mon panier</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{totalCartItems} article(s)</span>
              </Link>
            </div>

            <div className="bg-white border border-gray-200/60 rounded-2xl p-4 mb-8 text-xs flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400">Téléphone :</span>
                <span className="font-medium text-gray-800">{user.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Sécurité :</span>
                <span className="font-medium text-emerald-600">Compte protégé par mot de passe ✓</span>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-3 rounded-xl text-xs font-medium tracking-wider uppercase transition cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
        </ScrollReveal>
      )}

    </div>
  );
}