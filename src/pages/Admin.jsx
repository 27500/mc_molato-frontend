import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';

const ALLOWED_ADMIN_EMAILS = [
  'blessingmingenge@gmail.com',
  'cadieselipa222@icloud.com'
];

export default function Admin() {
  const [step, setStep] = useState('email');
  const [emailInput, setEmailInput] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Formulaire d'ajout d'article
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('homme');
  const [description, setDescription] = useState('');

  // Photo principale
  const [mainInputType, setMainInputType] = useState('file');
  const [mainFile, setMainFile] = useState(null);
  const [mainUrl, setMainUrl] = useState('');

  // Photos supplémentaires (gère dynamiquement 3 photos ou plus)
  const [extraPhotos, setExtraPhotos] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [customProducts, setCustomProducts] = useState([]);

  useEffect(() => {
    const authSession = sessionStorage.getItem('mc_molato_admin_verified');
    if (authSession === 'true') {
      setStep('dashboard');
      loadCustomProducts();
    }
  }, []);

  const loadCustomProducts = () => {
    const stored = JSON.parse(localStorage.getItem('mc_molato_custom_products') || '[]');
    setCustomProducts(stored);
  };

  // 📌 1. Demander l'envoi du vrai OTP par e-mail via le Backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      setMessage("Accès refusé : Cette adresse e-mail n'est pas autorisée en tant qu'administrateur.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('otp');
        setMessage('');
      } else {
        setMessage(data.message || "Erreur lors de l'envoi du code.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Impossible de contacter le serveur backend.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 2. Vérifier l'OTP via le Backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp: enteredOtp.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('mc_molato_admin_verified', 'true');
        setStep('dashboard');
        loadCustomProducts();
        setMessage('');
      } else {
        setMessage(data.message || 'Code OTP incorrect. Veuillez réessayer.');
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setMessage("Erreur lors de la vérification du code.");
    } finally {
      setLoading(false);
    }
  };

  const addExtraPhotoField = () => {
    setExtraPhotos([...extraPhotos, { id: Date.now(), type: 'file', file: null, url: '' }]);
  };

  const removeExtraPhotoField = (id) => {
    setExtraPhotos(extraPhotos.filter(p => p.id !== id));
  };

  const updateExtraPhoto = (id, field, value) => {
    setExtraPhotos(extraPhotos.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Utilitaire pour convertir un fichier en Base64 (persistant après actualisation)
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    let finalMainImage = '';
    if (mainInputType === 'file' && mainFile) {
      finalMainImage = await convertFileToBase64(mainFile);
    } else if (mainInputType === 'url' && mainUrl.trim()) {
      finalMainImage = mainUrl.trim();
    }

    if (!name || !price || !finalMainImage) {
      alert('Veuillez remplir le nom, le prix et fournir une photo principale valide.');
      return;
    }

    const numericPrice = Number(price);

    const extraImagesArray = [];
    for (const p of extraPhotos) {
      if (p.type === 'file' && p.file) {
        const base64Img = await convertFileToBase64(p.file);
        extraImagesArray.push(base64Img);
      } else if (p.type === 'url' && p.url.trim()) {
        extraImagesArray.push(p.url.trim());
      }
    }

    const uniqueId = `custom_${Date.now()}`;

    const newProduct = {
      id: uniqueId,
      name: name.trim(),
      priceFormatted: `${numericPrice.toLocaleString()} CDF`,
      rawPrice: numericPrice,
      category,
      description: description.trim() || 'Aucune description détaillée fournie.',
      image: finalMainImage,
      images: [finalMainImage, ...extraImagesArray],
      isCustom: true // Indicateur clé pour que les favoris reconnaissent l'article
    };

    const existingProducts = JSON.parse(localStorage.getItem('mc_molato_custom_products') || '[]');
    const updatedProducts = [newProduct, ...existingProducts];
    
    localStorage.setItem('mc_molato_custom_products', JSON.stringify(updatedProducts));
    
    setCustomProducts(updatedProducts);
    window.dispatchEvent(new Event('custom_products_updated'));

    setSuccessMessage('Article ajouté avec succès à la boutique ! 🎉');
    setName('');
    setPrice('');
    setDescription('');
    setMainFile(null);
    setMainUrl('');
    setExtraPhotos([]);

    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article de la boutique ?")) {
      const updatedProducts = customProducts.filter(p => p.id !== id);
      localStorage.setItem('mc_molato_custom_products', JSON.stringify(updatedProducts));
      
      setCustomProducts(updatedProducts);
      window.dispatchEvent(new Event('custom_products_updated'));
      
      setSuccessMessage('Article supprimé avec succès.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (step === 'email') {
    return (
      <div className="py-24 px-4 max-w-sm mx-auto text-gray-900">
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
            🛡️
          </div>
          <h1 className="text-xl font-serif font-medium mb-1">Portail Administrateur</h1>
          <p className="text-xs text-gray-500 mb-6">Réservé exclusivement aux e-mails autorisés.</p>

          {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <input 
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Entrez votre e-mail admin"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition text-center"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer le code OTP"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="py-24 px-4 max-w-sm mx-auto text-gray-900">
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm text-center">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg">
            🔑
          </div>
          <h1 className="text-xl font-serif font-medium mb-1">Vérification OTP</h1>
          <p className="text-xs text-gray-500 mb-6">Entrez le code à 4 chiffres envoyé par e-mail à <span className="font-semibold">{emailInput}</span>.</p>

          {message && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs rounded-xl">{message}</div>}

          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <input 
              type="text" 
              maxLength="4"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="• • • •"
              required
              className="w-full text-center tracking-[1rem] text-xl bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-sm disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Valider le code"}
            </button>
          </form>

          <button 
            onClick={() => setStep('email')}
            className="mt-4 text-xs text-gray-400 hover:text-black transition"
          >
            ← Changer d'e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-2xl mx-auto text-gray-900">
      <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm relative">
        
        <button 
          onClick={() => { sessionStorage.removeItem('mc_molato_admin_verified'); setStep('email'); }}
          className="absolute top-6 right-6 text-xs text-gray-400 hover:text-red-600 transition"
        >
          Se déconnecter 🔒
        </button>

        <div className="text-center mb-8">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            Session Admin Sécurisée Validée ✓
          </span>
          <h1 className="text-2xl font-serif font-light mt-3 mb-1">Tableau de Bord Admin</h1>
          <p className="text-xs text-gray-500">Gérez vos articles et consultez les messages de votre communauté.</p>
        </div>

        {/* --- LIEN VERS LA PAGE DES MESSAGES CLIENTS --- */}
        <div className="mb-8">
          <Link 
            to="/admin/messages" 
            className="flex items-center justify-between bg-black text-white p-4 rounded-2xl hover:bg-zinc-800 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">📬</span>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider">Boîte de réception des messages</h3>
                <p className="text-[10px] text-gray-300">Voir les avis et formulaires de la page À propos</p>
              </div>
            </div>
            <span className="text-sm font-bold">→</span>
          </Link>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 text-xs rounded-xl text-center font-medium">
            {successMessage}
          </div>
        )}

        {/* --- FORMULAIRE D'AJOUT --- */}
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4 text-xs mb-12 border-b border-gray-200 pb-10">
          <h2 className="text-sm font-serif font-medium text-gray-800 mb-[-4px]">➕ Publier un nouvel article</h2>

          <div>
            <label className="block font-medium text-gray-600 mb-1">Nom de l'habit</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Boubou Royal Prestige" 
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-600 mb-1">Prix (en CDF)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 120000" 
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">Catégorie</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition cursor-pointer"
              >
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="unisexe">Unisexe / Mixte</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-600 mb-1">Description & Détails</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la matière, les origines..." 
              rows="3"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition resize-none"
            ></textarea>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-700">Photo Principale *</label>
              <div className="flex gap-2 text-[10px]">
                <button 
                  type="button" 
                  onClick={() => setMainInputType('file')} 
                  className={`px-2.5 py-1 rounded-lg transition ${mainInputType === 'file' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  📁 Fichier local
                </button>
                <button 
                  type="button" 
                  onClick={() => setMainInputType('url')} 
                  className={`px-2.5 py-1 rounded-lg transition ${mainInputType === 'url' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  🔗 Lien URL
                </button>
              </div>
            </div>

            {mainInputType === 'file' ? (
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setMainFile(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer"
              />
            ) : (
              <input 
                type="text" 
                value={mainUrl}
                onChange={(e) => setMainUrl(e.target.value)}
                placeholder="Ex: /homme.jpeg ou https://..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-black transition"
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-medium text-gray-700">Photos Supplémentaires (Galeries)</label>
              <button
                type="button"
                onClick={addExtraPhotoField}
                className="bg-black text-white text-[10px] px-3 py-1.5 rounded-xl font-medium hover:bg-zinc-800 transition flex items-center gap-1 shadow-sm"
              >
                <span>+</span> Ajouter une photo
              </button>
            </div>

            {extraPhotos.map((photo, index) => (
              <div key={photo.id} className="bg-white p-4 rounded-2xl border border-gray-200 relative">
                <button
                  type="button"
                  onClick={() => removeExtraPhotoField(photo.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs font-bold"
                >
                  ✕
                </button>

                <div className="flex justify-between items-center mb-2 pr-6">
                  <span className="font-medium text-gray-600 text-[11px]">Photo supplémentaire #{index + 1}</span>
                  <div className="flex gap-2 text-[10px]">
                    <button 
                      type="button" 
                      onClick={() => updateExtraPhoto(photo.id, 'type', 'file')} 
                      className={`px-2 py-0.5 rounded-lg transition ${photo.type === 'file' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      📁 Fichier
                    </button>
                    <button 
                      type="button" 
                      onClick={() => updateExtraPhoto(photo.id, 'type', 'url')} 
                      className={`px-2 py-0.5 rounded-lg transition ${photo.type === 'url' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      🔗 URL
                    </button>
                  </div>
                </div>

                {photo.type === 'file' ? (
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => updateExtraPhoto(photo.id, 'file', e.target.files[0])}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300 cursor-pointer"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={photo.url}
                    onChange={(e) => updateExtraPhoto(photo.id, 'url', e.target.value)}
                    placeholder="Ex: /style2.jpeg ou lien web"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-black transition"
                  />
                )}
              </div>
            ))}
          </div>

          <button 
            type="submit"
            className="mt-4 w-full bg-black text-white py-3.5 rounded-xl text-xs font-medium tracking-wider uppercase hover:bg-zinc-800 transition shadow-md"
          >
            Publier l'article sur la boutique
          </button>
        </form>

        {/* --- GESTION & SUPPRESSION DES ARTICLES --- */}
        <div>
          <h2 className="text-sm font-serif font-medium text-gray-800 mb-4">🗑️ Gérer et supprimer les articles ajoutés ({customProducts.length})</h2>

          {customProducts.length === 0 ? (
            <p className="text-xs text-gray-400 italic bg-white p-4 rounded-2xl border border-gray-200 text-center">
              Aucun article personnalisé pour le moment.
            </p>
          ) : (
            <div className="space-y-3">
              {customProducts.map((product) => (
                <div key={product.id} className="bg-white p-3 rounded-2xl border border-gray-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100" 
                      onError={(e) => { e.target.src = '/logo.jpeg'; }}
                    />
                    <div className="truncate">
                      <h4 className="font-serif text-xs font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                        {product.priceFormatted || `${product.rawPrice?.toLocaleString()} CDF`} • <span className="uppercase text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">{product.category}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-medium transition flex-shrink-0 flex items-center gap-1"
                  >
                    <span>🗑️</span> Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}