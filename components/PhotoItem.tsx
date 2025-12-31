import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { Photo } from '../services/api';

const { width } = Dimensions.get('window');
const GAP = 8;
const COLUMNS = 2;
const ITEM_WIDTH = (width - GAP * (COLUMNS + 1)) / COLUMNS;

interface PhotoItemProps {
  photo: Photo;
  isFavorite: boolean;
  onPress: () => void;
}

const PhotoItemComponent: React.FC<PhotoItemProps> = ({
  photo,
  isFavorite,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image
        source={{ uri: photo.download_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.favoriteContainer}>
        <View style={[styles.heart, isFavorite && styles.heartFilled]}>
          <Text style={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const PhotoItem = React.memo(PhotoItemComponent);

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    marginBottom: GAP,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  heart: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartFilled: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  heartIcon: {
    fontSize: 18,
  },
});

