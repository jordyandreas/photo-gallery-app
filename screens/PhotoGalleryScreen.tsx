import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { Photo } from '../services/api';
import { PhotoItem } from '../components/PhotoItem';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorView } from '../components/ErrorView';
import { usePhotos } from '../hooks/usePhotos';
import { useFavorites } from '../hooks/useFavorites';

const GAP = 8;
const COLUMNS = 2;

export const PhotoGalleryScreen: React.FC = () => {
  const {
    photos,
    loading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    retry,
  } = usePhotos();

  const { isFavorite, toggleFavorite } = useFavorites();

  const renderItem = useCallback(
    ({ item }: { item: Photo }) => {
      return (
        <PhotoItem
          photo={item}
          isFavorite={isFavorite(item.id)}
          onPress={() => toggleFavorite(item.id)}
        />
      );
    },
    [isFavorite, toggleFavorite],
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
        <ErrorView message={error} onRetry={retry} />
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
