import { useState, useEffect, useCallback, useRef } from 'react';
import { Photo, fetchPhotos } from '../services/api';

interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  handleRefresh: () => void;
  handleLoadMore: () => void;
  retry: () => void;
}

export const usePhotos = (): UsePhotosReturn => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);

  const loadPhotos = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      // Prevent duplicate requests
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setError(null);
        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await fetchPhotos(pageNum, 20);

        if (reset) {
          setPhotos(response.photos);
        } else {
          setPhotos(prev => [...prev, ...response.photos]);
        }

        setHasMore(response.hasMore);
        setPage(pageNum);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load photos',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    loadPhotos(1, true);
  }, [loadPhotos]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadPhotos(1, true);
  }, [loadPhotos]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) {
      return;
    }

    loadPhotos(page + 1, false);
  }, [loadingMore, loading, hasMore, page, loadPhotos]);

  const retry = useCallback(() => {
    loadPhotos(1, true);
  }, [loadPhotos]);

  return {
    photos,
    loading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    retry,
  };
};

