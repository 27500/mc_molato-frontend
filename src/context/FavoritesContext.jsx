import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../services/api';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Fonction utilitaire pour obtenir la clé localStorage propre à l'utilisateur actuel
  const getLocalStorageKey = () => {
    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) return null;
    try {
      const user = JSON.parse(savedUser);
      return user?.email ? `mc_molato_favorites_${user.email}` : null;
    } catch (e) {
      return null;
    }
  };

  // Charger les favoris à la connexion ou au montage
  useEffect(() => {
    const loadFavorites = async () => {
      const savedUser = localStorage.getItem('mc_molato_user');
      
      if (!savedUser) {
        // Aucun utilisateur connecté : vider les favoris affichés
        setFavorites([]);
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        const storageKey = `mc_molato_favorites_${user.email}`;

        // 1. Charger d'abord depuis le stockage local spécifique à cet utilisateur (affichage instantané)
        const localFavs = localStorage.getItem(storageKey);
        if (localFavs) {
          setFavorites(JSON.parse(localFavs));
        }

        // 2. Synchroniser avec le Backend
        const response = await fetch(`${API_URL}/users/get-favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email })
        });
        const data = await response.json();
        
        if (response.ok && data.favorites) {
          setFavorites((prevFavs) => {
            const combined = [...data.favorites];
            
            // Fusionner avec les favoris locaux pour ne rien perdre
            prevFavs.forEach(localFav => {
              if (!combined.some(item => String(item.id) === String(localFav.id))) {
                combined.push(localFav);
              }
            });

            localStorage.setItem(storageKey, JSON.stringify(combined));
            return combined;
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
      }
    };

    loadFavorites();

    // Écouter les changements de connexion/déconnexion en temps réel via le localStorage
    const handleStorageChange = () => {
      loadFavorites();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fonction pour ajouter ou retirer un favori
  const toggleFavorite = async (product) => {
    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) {
      alert("Veuillez vous connecter pour gérer vos favoris.");
      return;
    }

    // Conserver l'image originale sans la corrompre
    const cleanProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      priceFormatted: product.priceFormatted,
      rawPrice: product.rawPrice,
      image: product.image,
      images: product.images,
      description: product.description
    };

    const isAlreadyFavorite = favorites.some((fav) => String(fav.id) === String(cleanProduct.id));
    let updatedFavorites;

    if (isAlreadyFavorite) {
      updatedFavorites = favorites.filter((fav) => String(fav.id) !== String(cleanProduct.id));
    } else {
      updatedFavorites = [...favorites, cleanProduct];
    }

    // Mise à jour de l'interface et du stockage local propre à l'utilisateur
    setFavorites(updatedFavorites);
    const storageKey = getLocalStorageKey();
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
      } catch (e) {
        console.error("LocalStorage plein ou bloqué :", e);
      }
    }

    // Synchronisation avec le serveur
    try {
      const user = JSON.parse(savedUser);
      await fetch(`${API_URL}/users/update-favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, favorites: updatedFavorites })
      });
    } catch (error) {
      console.error("Erreur de synchronisation serveur :", error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}