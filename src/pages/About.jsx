import React, { useState } from 'react';

export default function About() {
  // État pour gérer le formulaire de contact
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu pourras plus tard connecter ton API Laravel pour envoyer le message
    console.log("Message envoyé :", formData);
    setSubmitted(true);
  };

  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto text-gray-900">
      
      {/* ================= SECTION PRÉSENTATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        
        {/* Image illustrative */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-sm h-[400px] bg-gray-100">
          <img 
            src="/selipa.jpeg" 
            alt="L'histoire de Mc Molato" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texte de présentation */}
        <div>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2 block">Notre Héritage</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-light mb-6">À propos de Mc Molato</h1>
          <p className="text-gray-600 font-light leading-relaxed mb-4">
            Fondé avec une vision passionnée, **Mc Molato** célèbre la richesse, la profondeur et l'élégance de l'héritage africain à travers chaque fil tissé. Nous croyons que la mode est un pont entre les traditions ancestrales et le design contemporain.
          </p>
          <p className="text-gray-600 font-light leading-relaxed mb-6">
            Chaque pièce de notre collection est le fruit d'un travail minutieux réalisé par des artisans locaux talentueux. En choisissant Mc Molato, vous soutenez un artisanat éthique, durable et porteur d'histoires uniques.
          </p>
          <div className="border-l-2 border-black pl-4 italic text-sm text-gray-800 font-light">
            "Porter Mc Molato, c'est porter la tradition avec fierté et modernité."
          </div>
        </div>

      </div>

      {/* ================= SECTION CONTACT & MESSAGERIE ================= */}
      <div className="bg-[#f7f7f7] border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-serif mb-3">Contactez-nous</h2>
          <p className="text-gray-500 text-sm font-light">
            Une question sur nos tissus, une commande sur mesure ou simplement envie de nous écrire ? Remplissez le formulaire ci-dessous.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
            <span className="text-4xl mb-3 block">✨</span>
            <h3 className="text-xl font-serif mb-2">Message envoyé !</h3>
            <p className="text-gray-600 text-xs font-light mb-6">
              Merci {formData.prenom}, notre équipe vousrecontactera dans les plus brefs délais à l'adresse {formData.email}.
            </p>
            <button 
              onClick={() => { setSubmitted(false); setFormData({ prenom: '', nom: '', email: '', message: '' }); }}
              className="bg-black text-white text-xs tracking-wider uppercase px-6 py-3 rounded-full font-medium transition hover:bg-zinc-800"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">Prénom</label>
                <input 
                  type="text" 
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Ex : Aminata"
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
                  placeholder="Ex : Diallo"
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
                placeholder="Ex : aminata@example.com"
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
              className="mt-2 bg-black hover:bg-zinc-800 text-white text-xs tracking-wider uppercase px-6 py-4 rounded-full font-medium transition shadow-md w-full"
            >
              Envoyer le message
            </button>

          </form>
        )}

      </div>

    </div>
  );
}