import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { 
  testServerConnection, 
  fetchModels,
  setServerIP, 
  setServerPort,
  selectServer 
} from '../store/serverSlice';

import { homeStyles as styles } from './HomeScreen.styles';

export default function HomeScreen() {
  const dispatch = useDispatch();
  
  // État du serveur
  const server = useSelector(selectServer);
  const { 
    ip, 
    port, 
    isConnected, 
    isConnecting, 
    connectionMessage, 
    models, 
    error,
    isFetchingModels
  } = server;

  // Test de connexion
  const handleTestConnection = async () => {
    if (!ip.trim() || !port.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir l\'IP et le port du serveur');
      return;
    }

    try {
      const result = await dispatch(testServerConnection({ ip, port })).unwrap();
      
      Alert.alert(
        'Connexion réussie ! 🎉',
        `Serveur RAVE connecté\nRéponse: ${result.message}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Connexion échouée',
        `Impossible de se connecter au serveur:\n${error}\n\nVérifiez que le serveur Python est démarré.`
      );
    }
  };

  // Récupération des modèles
  const handleGetModels = async () => {
    if (!isConnected) {
      Alert.alert('Erreur', 'Testez d\'abord la connexion au serveur');
      return;
    }

    console.log('🔄 Démarrage récupération des modèles...');
    
    try {
      const result = await dispatch(fetchModels()).unwrap();
      console.log('✅ Modèles récupérés:', result);
      
      if (result && result.length > 0) {
        Alert.alert(
          'Modèles RAVE disponibles 🎼',
          '• ' + result.join('\n• '),
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Info', 'Aucun modèle trouvé sur le serveur');
      }
    } catch (error) {
      console.log('Erreur lors de la récupération:', error);
      Alert.alert(
        'Erreur récupération modèles', 
        `Détail: ${error}`
      );
    }
  };

  // Récupération automatique des modèles après connexion
  useEffect(() => {
    if (isConnected && models.length === 0) {
      console.log('Récupération automatique des modèles...');
      dispatch(fetchModels());
    }
  }, [isConnected, dispatch, models.length]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎵 RAVE Audio Transfer</Text>
        <Text style={styles.subtitle}>Connexion au serveur</Text>
      </View>

      <View style={styles.form}>
        {/* IP du serveur */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse IP du serveur</Text>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={(text) => dispatch(setServerIP(text))}
            placeholder="192.168.1.17"
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </View>

        {/* Port du serveur */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Port du serveur</Text>
          <TextInput
            style={styles.input}
            value={port}
            onChangeText={(text) => dispatch(setServerPort(text))}
            placeholder="8000"
            keyboardType="numeric"
          />
        </View>

        {/* Bouton de connexion */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            isConnecting && styles.buttonDisabled
          ]}
          onPress={handleTestConnection}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? 'Connexion...' : 'Tester la connexion'}
          </Text>
        </TouchableOpacity>

        {/* Statut de connexion */}
        {(isConnected || error) && (
          <View style={[
            styles.statusIndicator,
            isConnected ? styles.statusSuccess : styles.statusError
          ]}>
            <Text style={styles.statusText}>
              {isConnected 
                ? `✅ Serveur connecté${models.length > 0 ? ` - ${models.length} modèles` : ''}` 
                : `❌ ${error}`
              }
            </Text>
          </View>
        )}

        {/* Bouton modèles */}
        {isConnected && (
          <TouchableOpacity
            style={[
              styles.button, 
              styles.secondaryButton,
              isFetchingModels && styles.buttonDisabled
            ]}
            onPress={handleGetModels}
            disabled={isFetchingModels}
          >
            <Text style={styles.secondaryButtonText}>
              {isFetchingModels 
                ? '🔄 Récupération...' 
                : `📋 Voir les modèles disponibles (${models.length})`
              }
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Assurez-vous que le serveur Python RAVE est démarré avec{'\n'}
          <Text style={styles.code}>python server.py</Text>
        </Text>
      </View>

      {/* Debug sans crash */}
      {__DEV__ && (
        <View style={styles.debug}>
          <Text style={styles.debugText}>
            🔧 Debug:{'\n'}
            Connected: {String(isConnected)}{'\n'}
            Models: {models.length}{'\n'}
            Fetching: {String(Boolean(isFetchingModels))}{'\n'}
            Error: {error || 'None'}
          </Text>
        </View>
      )}
    </View>
  );
}