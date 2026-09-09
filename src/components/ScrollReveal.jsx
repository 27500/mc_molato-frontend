import React, { useEffect, useRef } from 'react';

export default function ScrollReveal({ 
  children, 
  animation = 'fade-up', // Options: 'fade-up', 'fade-in', 'zoom-in'
  duration = 700,        // Durée de l'animation en millisecondes
  delay = 0,             // Délai avant le déclenchement
  className = ''         // Classes CSS additionnelles si besoin
}) {
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optionnel : si tu veux que l'animation se joue une seule fois, décommente la ligne ci-dessous :
          // observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // Déclenche quand 10% de l'élément est visible

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Définition des styles de base et des animations
  const getAnimationStyle = () => {
    switch (animation) {
      case 'fade-in':
        return 'opacity-0 transition-opacity ease-out';
      case 'zoom-in':
        return 'opacity-0 scale-95 transition-all ease-out';
      case 'fade-up':
      default:
        return 'opacity-0 translate-y-8 transition-all ease-out';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`scroll-reveal-element ${getAnimationStyle()} [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 [&.is-visible]:scale-100 ${className}`}
    >
      {children}
    </div>
  );
}