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

// Import des actions Redux
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
  
  // Récupération de l'état du serveur depuis le store Redux
  const server = useSelector(selectServer);
  const { 
    ip,                    // Adresse IP du serveur (ex: '192.168.1.17')
    port,                  // Port du serveur (ex: '8000')
    isConnected,           // true si connecté avec succès
    isConnecting,          // true pendant la tentative de connexion
    connectionMessage,     // Message de réponse du serveur
    models,                // Liste des modèles RAVE disponibles ['Jazz', 'Darbouka', ...]
    error                  // Message d'erreur en cas d'échec
  } = server;

  const handleTestConnection = async () => {
    if (!ip.trim() || !port.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir l\'IP et le port du serveur');
      return;
    }

    try {
      // Lancement de l'action asynchrone
      // unwrap() permet de récupérer directement le résultat ou l'erreur
      const result = await dispatch(testServerConnection({ ip, port })).unwrap();
      
      Alert.alert(
        'Connexion réussie !',
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

  //Affiche la liste des modèles RAVE disponibles
  const handleGetModels = async () => {
    if (!isConnected) {
      Alert.alert('Erreur', 'Testez d\'abord la connexion au serveur');
      return;
    }
    try {
      // Récupération des modèles depuis l'endpoint /getmodels
      await dispatch(fetchModels()).unwrap();
      
      if (models.length > 0) {
        Alert.alert(
          'Modèles RAVE disponibles 🎼',
          '• ' + models.join('\n• '),
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les modèles');
    }
  };

  // === EFFETS ===
  /*Récupération automatique des modèles après connexion
   * Se déclenche quand isConnected passe à true*/
  useEffect(() => {
    if (isConnected && models.length === 0) {
      dispatch(fetchModels());
    }
  }, [isConnected, dispatch, models.length]);

  // === RENDU ===
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* En-tête de l'application */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 RAVE Audio Transfer</Text>
        <Text style={styles.subtitle}>Connexion au serveur</Text>
      </View>

      {/* Formulaire de configuration */}
      <View style={styles.form}>
        
        {/* Champ IP du serveur */}
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

        {/* Champ Port du serveur */}
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

        {/* Bouton de test de connexion */}
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
            {isConnecting ? '🔄 Connexion...' : '🔗 Tester la connexion'}
          </Text>
        </TouchableOpacity>

        {/* Indicateur de statut de connexion */}
        {(isConnected || error) && (
          <View style={[
            styles.statusIndicator,
            isConnected ? styles.statusSuccess : styles.statusError
          ]}>
            <Text style={styles.statusText}>
              {isConnected 
                ? `Serveur connecté${models.length > 0 ? ` - ${models.length} modèles` : ''}` 
                : `${error}`
              }
            </Text>
          </View>
        )}

        {/* Bouton pour afficher les modèles (visible seulement si connecté) */}
        {isConnected && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGetModels}
          >
            <Text style={styles.secondaryButtonText}>
              📋 Voir les modèles disponibles ({models.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Section d'information */}
      <View style={styles.info}>
        <Text style={styles.infoText}>
          💡 Assurez-vous que le serveur Python RAVE est démarré avec{'\n'}
          <Text style={styles.code}>python server.py</Text>
        </Text>
      </View>

      {/* Informations de debug (visible seulement en développement) */}
      {__DEV__ && (
        <View style={styles.debug}>
          <Text style={styles.debugText}>
            🔧 Debug: Connected={isConnected.toString()}, Models={models.length}
          </Text>
        </View>
      )}
    </View>
  );
}