import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { Photo, fetchPhotos } from '../services/api';
import { PhotoItem } from '../components/PhotoItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorView } from '../components/ErrorView';
import FavoriteConfirmationModule from '../native/FavoriteConfirmationModule';

const GAP = 8;
const COLUMNS = 2;

export const PhotoGalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
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
        setError(err instanceof Error ? err.message : 'Failed to load photos');
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

  const handleFavoritePress = useCallback((photoId: string) => {
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

      if (FavoriteConfirmationModule && FavoriteConfirmationModule.showToast) {
        try {
          FavoriteConfirmationModule.showToast(message);
        } catch (err) {
          console.error('Error showing toast:', err);
        }
      } else {
        console.log('FavoriteConfirmationModule not available');
      }

      return newFavorites;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Photo }) => {
      return (
        <PhotoItem
          photo={item}
          isFavorite={favorites.has(item.id)}
          onPress={() => handleFavoritePress(item.id)}
        />
      );
    },
    [favorites, handleFavoritePress],
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return <LoadingSpinner />;
  }, [loadingMore]);

  if (loading && photos.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && photos.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorView message={error} onRetry={() => loadPhotos(1, true)} />
      </View>
    );
  }

  if (!loading && !error && photos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: GAP,
  },
  row: {
    justifyContent: 'space-between',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});
