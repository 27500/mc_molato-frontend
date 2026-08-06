import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { API_URL } from '../services/api';

export default function Account() {
  const [step, setStep] = useState('loading'); // 'register', 'login-email', 'verify-otp', 'dashboard'
  
  // États du formulaire d'inscription
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // États pour la connexion / OTP
  const [loginEmail, setLoginEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const { cart } = useCart();
  const { favorites } = useFavorites();
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const savedUser = localStorage.getItem('mc_molato_user');
    const isLogged = localStorage.getItem('mc_molato_logged');

    if (savedUser && isLogged === 'true') {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setStep('dashboard');
    } else {
      setStep('register');
    }
  }, []);

  // Inscription connectée au Backend
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Erreur lors de l'inscription.");
        return;
      }

      const newUser = { name: data.name, email: data.email, phone: phone || '' };
      localStorage.setItem('mc_molato_user', JSON.stringify(newUser));
      setUser(newUser);
      setMessage('');
      setLoginEmail(data.email);
      setStep('login-email');
    } catch (error) {
      setMessage("Erreur de connexion avec le serveur backend.");
    }
  };

  // Demander un VRAI OTP par e-mail (Nodemailer)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage('Envoi du code en cours...');
    
    try {
      const response = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim() })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Cet email ne correspond à aucun compte enregistré.');
        return;
      }

      setMessage('');
      setStep('verify-otp');
    } catch (error) {
      setMessage("Erreur de connexion avec le serveur backend.");
    }
  };

  // Vérifier le VRAI OTP auprès du Backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), otp: enteredOtp.trim() })
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Code OTP incorrect.');
        return;
      }

      // TRÈS IMPORTANT : On sauvegarde le bon utilisateur connecté et l'état de connexion
      if (data.user) {
        localStorage.setItem('mc_molato_user', JSON.stringify(data.user));
        setUser(data.user);
      }
      localStorage.setItem('mc_molato_logged', 'true');
      
      setStep('dashboard');
      setMessage('');
      
      // Recharge la page pour forcer la mise à jour des favoris/panier du nouveau compte
      window.location.reload();
    } catch (error) {
      setMessage("Erreur de connexion avec le serveur backend.");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('mc_molato_logged');
    localStorage.removeItem('mc_molato_user'); // Supprime l'utilisateur pour vider les données
    setUser(null);
    setStep('login-email');
    window.location.reload();
  };

  if (step === 'loading') {
    return <div className="py-20 text-center text-gray-500 text-sm">Chargement de votre espace...</div>;
  }

  return (
    <div className="py-12 px-4 max-w-lg mx-auto text-gray-900">
      
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Link to="/">
          <img 
            src="/logo.jpeg" 
            alt="Mc Molato Logo" 
            className="w-16 h-16 object-cover rounded-2xl shadow-md border border-gray-100 hover:opacity-90 transition"
          />
        </Link>
      </div>

      {/* 1. INSCRIPTION */}
      {step === 'register' && (
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <h1 className="text-2xl font-serif font-light mb-2 text-center">Créer un compte</h1>
          <p className="text-xs text-gray-500 text-center mb-6">Rejoignez Mc Molato pour suivre vos commandes et favoris.</p>

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
              className="mt-2 w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm"
            >
              S'inscrire
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-200/60 pt-4">
            <span className="text-xs text-gray-400">Déjà un compte ? </span>
            <button 
              onClick={() => {
                const saved = localStorage.getItem('mc_molato_user');
                if (saved) {
                  const p = JSON.parse(saved);
                  setLoginEmail(p.email);
                }
                setStep('login-email');
              }} 
              className="text-xs font-medium text-black underline hover:text-gray-700 transition ml-1"
            >
              Se connecter
            </button>
          </div>
        </div>
      )}

      {/* 2. CONNEXION : SAISIE EMAIL */}
      {step === 'login-email' && (
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <h1 className="text-2xl font-serif font-light mb-2 text-center">Connexion</h1>
          <p className="text-xs text-gray-500 text-center mb-6">Entrez votre email pour recevoir votre code OTP par e-mail.</p>

          {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Votre Adresse Email</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="votre.email@gmail.com"
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm"
            >
              Envoyer le code OTP
            </button>
          </form>
          
          <div className="mt-6 text-center border-t border-gray-200/60 pt-4 flex items-center justify-between text-xs">
            <button 
              onClick={() => setStep('register')}
              className="text-gray-400 hover:text-black transition"
            >
              Pas encore de compte ? <span className="font-medium underline">S'inscrire</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. VÉRIFICATION OTP */}
      {step === 'verify-otp' && (
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm text-center">
          <h1 className="text-2xl font-serif font-light mb-2">Vérification d'identité</h1>
          <p className="text-xs text-gray-500 mb-6">
            Entrez le code à 4 chiffres envoyé à <span className="font-semibold text-black">{loginEmail}</span>.
          </p>

          {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <input 
                type="text" 
                maxLength="4"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="• • • •"
                required
                className="w-full text-center tracking-[1rem] text-xl bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm"
            >
              Confirmer et se connecter
            </button>
          </form>

          <button 
            onClick={() => setStep('login-email')}
            className="mt-4 text-xs text-gray-400 hover:text-black transition"
          >
            ← Changer d'adresse email
          </button>
        </div>
      )}

      {/* 4. DASHBOARD */}
      {step === 'dashboard' && user && (
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black text-white text-2xl font-serif rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="text-2xl font-serif font-medium">{user.name}</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
            <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
              Client VIP Vérifié ✓
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
              <span className="font-medium text-emerald-600">Authentification OTP par e-mail active</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-3 rounded-xl text-xs font-medium tracking-wider uppercase transition"
          >
            Se déconnecter
          </button>
        </div>
      )}

    </div>
  );
}