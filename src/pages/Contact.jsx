import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Objet structuré prêt pour l'API Backend et MongoDB
    const messageData = {
      id: Date.now(),
      name: `${formData.prenom} ${formData.nom}`.trim(),
      prenom: formData.prenom.trim(),
      nom: formData.nom.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    let isSent = false;

    // 1. Envoi vers l'API Backend (prêt pour la production / déploiement)
    // En production, remplace 'http://localhost:5000' par l'URL de ton serveur déployé (ou utilise une variable d'environnement comme import.meta.env.VITE_API_URL)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        isSent = true;
      } else {
        throw new Error("Erreur serveur lors de l'enregistrement.");
      }
    } catch (err) {
      console.warn("Backend non disponible, passage sur le stockage de secours local (localStorage).", err);
      
      // 2. Secours local (localStorage) pour ne pas bloquer si le backend est hors ligne en dev
      try {
        const existingMessages = JSON.parse(localStorage.getItem('mc_molato_contact_messages') || '[]');
        const updatedMessages = [messageData, ...existingMessages];
        localStorage.setItem('mc_molato_contact_messages', JSON.stringify(updatedMessages));
        isSent = true; // Permet de valider l'envoi visuellement même sans serveur en local
      } catch (localErr) {
        console.error("Erreur localStorage:", localErr);
      }
    } finally {
      setLoading(false);
    }

    if (isSent) {
      setSubmitted(true);
    } else {
      setError("Impossible d'envoyer le message pour le moment. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto text-gray-900">
      
      {/* En-tête de la page */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2 block">Restons en contact</span>
        <h1 className="text-3xl lg:text-5xl font-serif mb-3">Contactez-nous</h1>
        <p className="text-gray-500 text-sm font-light">
          Une question sur nos tissus, une commande sur mesure ou l'envie de nous rendre visite ? Notre équipe est à votre écoute.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ================= SECTION INFORMATIONS & RÉSEAUX ================= */}
        <div className="lg:col-span-1 bg-[#f7f7f7] border border-gray-200/80 rounded-[2.5rem] p-8 flex flex-col justify-between gap-8">
          <div>
            <h2 className="text-xl font-serif mb-6">Nos Coordonnées</h2>
            
            {/* Adresse */}
            <div className="flex items-start gap-4 mb-6">
              <span className="text-xl">📍</span>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Adresse</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Boutique Mc Molato<br />
                  Avenue principale / commune <br />
                  kinshasa RDC
                </p>
              </div>
            </div>

            {/* Email direct */}
            <div className="flex items-start gap-4 mb-6">
              <span className="text-xl">✉️</span>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Email</h3>
                <p className="text-sm text-gray-600 font-light">
                  contact@mcmolato.com
                </p>
              </div>
            </div>

            {/* Téléphone / WhatsApp */}
            <div className="flex items-start gap-4">
              <span className="text-xl">📞</span>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Téléphone / WhatsApp</h3>
                <p className="text-sm text-gray-600 font-light">
                  +212 6 00 00 00 00
                </p>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3">Suivez-nous</h3>
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" title="WhatsApp" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
              {/* Snapchat */}
              <a href="https://snapchat.com" target="_blank" rel="noreferrer" title="Snapchat" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 2C7.307 2 3.5 5.817 3.5 10.527c0 4.015 2.766 7.378 6.471 8.243-.284-.66-.475-1.416-.541-2.257-.074-.94-.035-1.79.13-2.502-.279-.313-.483-.807-.584-1.393-.11-.645-.04-1.298.196-1.841-.301-.974-.241-2.152.196-3.238.653-.083 1.662.333 2.508 1.134.825-.795 1.82-1.21 2.464-1.132.445 1.082.504 2.261.201 3.235.24.545.312 1.201.201 1.847-.1.589-.306 1.085-.588 1.4-.16.717-.122 1.571-.148 2.515-.067.846-.26 1.607-.547 2.271 3.732-.857 6.523-4.229 6.523-8.254C20.534 5.817 16.727 2 12.017 2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* ================= SECTION FORMULAIRE DE CONTACT ================= */}
        <div className="lg:col-span-2 bg-[#f7f7f7] border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12">
          <h2 className="text-xl font-serif mb-6">Envoyez-nous un message</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
              <span className="text-4xl mb-3 block">✨</span>
              <h3 className="text-xl font-serif mb-2">Message envoyé !</h3>
              <p className="text-gray-600 text-xs font-light mb-6">
                Merci {formData.prenom}, notre équipe vous recontactera dans les plus brefs délais à l'adresse {formData.email}.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ prenom: '', nom: '', email: '', message: '' }); }}
                className="bg-black text-white text-xs tracking-wider uppercase px-6 py-3 rounded-full font-medium transition hover:bg-zinc-800"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-700">Prénom</label>
                  <input 
                    type="text" 
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="écrivez votre prénom ici..."
                    className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-black transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-700">Nom</label>
                  <input 
                    type="text" 
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="écrivez votre nom ici..."
                    className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">Adresse mail</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex : votre_nom@example.com"
                  className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-black transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">Votre message</label>
                <textarea 
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez votre message ici..."
                  className="bg-white border border-gray-200 rounded-2xl p-5 text-sm outline-none focus:border-black transition resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-2 bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs tracking-wider uppercase px-6 py-4 rounded-full font-medium transition shadow-md w-full cursor-pointer"
              >
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}