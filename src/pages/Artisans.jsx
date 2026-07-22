import React from 'react';

export default function Artisans() {
  return (
    <div className="py-8 px-4 max-w-[1200px] mx-auto text-gray-900">
      
      <div className="max-w-2xl mb-12">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-medium mb-2 block">Savoir-faire d'exception</span>
        <h1 className="text-4xl lg:text-5xl font-serif font-light mb-4">Nos Artisans</h1>
        <p className="text-gray-600 font-light">
          Derrière chaque fil tissé se cachent des mains de maître, un savoir-faire transmis de génération en génération et une passion inconditionnelle pour l'art de la mode africaine.
        </p>
      </div>

      {/* Mise en avant de la fondatrice & artisane principale avec une VIDÉO */}
      <div className="bg-[#f7f7f7] border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Vidéo de présentation */}
        <div className="relative rounded-[2rem] overflow-hidden h-[400px] bg-gray-900 shadow-sm">
          <video 
            src="/atelier.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>

        <div className="flex flex-col gap-4">
          <span className="bg-black text-white text-xs tracking-wider uppercase px-4 py-1.5 rounded-full w-max font-medium">
            Fondatrice & Maître Artisane
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif">Cadie Selipa <span className="text-gray-400 font-light text-2xl block">(alias Mc Molato)</span></h2>
          <p className="text-gray-600 font-light leading-relaxed">
            Passionnée dès son plus jeune âge par l'art du textile et les motifs traditionnels, **Cadie Selipa** est le cœur battant et l'esprit créatif derrière la marque **Mc Molato**.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            À travers son parcours, elle a voulu réinventer le vêtement africain traditionnel en l'adaptant aux exigences du style moderne, tout en garantissant un processus de fabrication 100 % éthique et fait main. Chaque collection porte sa vision d'un héritage culturel vivant, audacieux et intemporel.
          </p>
          <div className="pt-2">
            <blockquote className="border-l-2 border-black pl-4 italic text-sm text-gray-800 font-light">
              "Créer un vêtement Mc Molato, c'est raconter une histoire d'amour avec nos racines."
            </blockquote>
          </div>
        </div>

      </div>

    </div>
  );
}