import React from 'react';

export default function Lookbook() {
  const looks = [
    {
      id: 1,
      title: "L'Héritage Bogolan",
      season: "Collection Automne / Hiver",
      description: "Le Bogolan, tissu traditionnel malien teint à la terre fermentée, rencontre la coupe architecturale des tailleurs modernes. Un look pensé pour s'imposer en milieu professionnel tout en célébrant ses racines.",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
      pieces: ["Veste cintrée Bogolan", "Pantalon large lin noir", "Ceinture tressée à la main"]
    },
    {
      id: 2,
      title: "L'Éclat du Bazin Riche",
      season: "Édition Cérémonie & Soirée",
      description: "Reconnaissable à sa brillance et son maintien parfait, le Bazin est sculpté ici en robe de soirée minimaliste. Les broderies au fil d'or subliment le col sans surcharger la silhouette.",
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop",
      pieces: ["Robe longue Bazin teint à la main", "Étole en soie assortie"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-terracotta text-xs font-bold uppercase tracking-widest">Inspirations & Stylisme</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ebony mt-2">Le Lookbook</h1>
        <p className="mt-4 text-gray-600">Explorez nos visions stylistiques. Chaque tenue raconte l'histoire d'un artisanat d'excellence.</p>
      </div>

      <div className="space-y-24">
        {looks.map((look, index) => (
          /* Alternance responsive : un coup image à gauche, un coup image à droite sur grand écran */
          <div key={look.id} className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Image (Format portrait éditorial) */}
            <div className="w-full lg:w-1/2 aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <img src={look.imageUrl} alt={look.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Détails du Look */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="text-waxgold font-semibold text-sm tracking-wider uppercase">{look.season}</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-ebony mt-2 mb-6">{look.title}</h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">{look.description}</p>
              
              <div className="bg-white p-6 rounded-xl border border-terracotta/20 shadow-sm mb-8">
                <h4 className="text-xs uppercase font-bold text-terracotta tracking-wider mb-3">Pièces composant ce look :</h4>
                <ul className="list-disc list-inside space-y-1 text-ebony text-sm font-medium">
                  {look.pieces.map((piece, i) => (
                    <li key={i}>{piece}</li>
                  ))}
                </ul>
              </div>

              <div>
                <button className="bg-ebony text-sand px-8 py-4 rounded-xl font-medium hover:bg-terracotta transition-colors shadow-lg">
                  Prendre rendez-vous stylisme (Sur-mesure)
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}