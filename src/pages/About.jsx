import React from 'react';

export default function About() {
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

    </div>
  );
}