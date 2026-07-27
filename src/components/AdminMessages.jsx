import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification de sécurité de la session admin
    const authSession = sessionStorage.getItem('mc_molato_admin_verified');
    if (authSession !== 'true') {
      navigate('/admin');
      return;
    }
    loadMessages();
  }, [navigate]);

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('mc_molato_contact_messages') || '[]');
    setMessages(storedMessages);
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
      const updatedMessages = messages.filter(msg => msg.id !== id);
      localStorage.setItem('mc_molato_contact_messages', JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
      setSuccessMessage('Message supprimé avec succès.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider tous les messages reçus ?")) {
      localStorage.removeItem('mc_molato_contact_messages');
      setMessages([]);
      setSuccessMessage('Tous les messages ont été effacés.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto text-gray-900">
      <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] shadow-sm relative">
        
        {/* Navigation de retour */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/admin" 
            className="text-xs bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition font-medium"
          >
            ← Retour au Dashboard Admin
          </Link>
          <span className="text-xs text-gray-400 font-serif">Boîte de Réception • Mc Molato</span>
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg shadow-sm">
            📬
          </div>
          <h1 className="text-2xl font-serif font-light mb-1">Messages de la Page À propos</h1>
          <p className="text-xs text-gray-500">Consultez les requêtes et avis envoyés directement par vos visiteurs.</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 text-xs rounded-xl text-center font-medium">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
            Total messages : {messages.length}
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium transition"
            >
              Tout effacer 🗑️
            </button>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
            <p className="text-xs text-gray-400 italic">Aucun message reçu pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col gap-3">
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-medium text-sm text-gray-900">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:underline font-mono">
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      {msg.date || 'Récemment'}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                      title="Supprimer ce message"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                <div className="flex justify-end">
                  <a
                    href={`mailto:${msg.email}?subject=Réponse de Mc Molato&body=Bonjour ${msg.name},`}
                    className="bg-black text-white text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-zinc-800 transition font-medium"
                  >
                    Répondre par e-mail ✉️
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}