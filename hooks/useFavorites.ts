import { useState, useCallback } from 'react';
import FavoriteConfirmationModule from '../native/FavoriteConfirmationModule';

interface UseFavoritesReturn {
  favorites: Set<string>;
  isFavorite: (photoId: string) => boolean;
  toggleFavorite: (photoId: string) => void;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const isFavorite = useCallback(
    (photoId: string) => {
      return favorites.has(photoId);
    },
    [favorites],
  );

  const toggleFavorite = useCallback((photoId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      const wasFavorite = newFavorites.has(photoId);

      if (wasFavorite) {
        newFavorites.delete(photoId);
      } else {
        newFavorites.add(photoId);
      }

      const message = wasFavorite
        ? 'Image removed from favorites'
        : 'Image added to favorites';

      if (FavoriteConfirmationModule?.showToast) {
        try {
          FavoriteConfirmationModule.showToast(message);
        } catch (err) {
          console.error('Error showing toast:', err);
        }
      }

      return newFavorites;
    });
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
};

