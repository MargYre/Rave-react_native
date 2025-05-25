import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text } from 'react-native';
import { store, persistor } from './src/store';
import HomeScreen from './src/screens/HomeScreen';

// Composant de chargement pendant la restauration du store
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Chargement de l'application...</Text>
  </View>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <HomeScreen />
      </PersistGate>
    </Provider>
  );
}