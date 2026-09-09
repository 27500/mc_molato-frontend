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
        setFavorites([]);
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        const storageKey = `mc_molato_favorites_${user.email}`;

        // 1. Charger depuis le stockage local (affichage instantané)
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
              const localId = localFav._id || localFav.id;
              if (!combined.some(item => String(item._id || item.id) === String(localId))) {
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

    const handleStorageChange = () => {
      loadFavorites();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fonction pour ajouter ou retirer un favori de manière ultra-sécurisée
  const toggleFavorite = async (product) => {
    const savedUser = localStorage.getItem('mc_molato_user');
    if (!savedUser) {
      alert("Veuillez vous connecter pour gérer vos favoris.");
      return;
    }

    // Récupérer l'ID qu'il vienne de MongoDB (_id) ou d'un objet classique (id)
    const productId = product._id || product.id;

    // Conserver l'objet propre avec son _id et son id préservés
    const cleanProduct = {
      _id: product._id || product.id,
      id: product.id || product._id,
      name: product.name,
      category: product.category,
      priceFormatted: product.priceFormatted,
      rawPrice: product.rawPrice,
      image: product.image,
      images: product.images,
      description: product.description
    };

    // Vérifier l'existence en comparant _id ou id de manière universelle
    const isAlreadyFavorite = favorites.some((fav) => {
      const favId = fav._id || fav.id;
      return String(favId) === String(productId);
    });

    let updatedFavorites;

    if (isAlreadyFavorite) {
      // Retirer des favoris
      updatedFavorites = favorites.filter((fav) => {
        const favId = fav._id || fav.id;
        return String(favId) !== String(productId);
      });
    } else {
      // Ajouter aux favoris (on s'assure de ne pas dupliquer)
      if (!favorites.some(fav => String(fav._id || fav.id) === String(productId))) {
        updatedFavorites = [...favorites, cleanProduct];
      } else {
        updatedFavorites = [...favorites];
      }
    }

    // Mise à jour de l'état et du stockage local
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