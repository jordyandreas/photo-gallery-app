/**
 * Photo Gallery App
 * Fetches images from Lorem Picsum API with infinite scroll and favorite functionality
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PhotoGalleryScreen } from './screens/PhotoGalleryScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <PhotoGalleryScreen />
    </SafeAreaProvider>
  );
}

export default App;
