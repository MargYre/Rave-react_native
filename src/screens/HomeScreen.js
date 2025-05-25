import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function HomeScreen() {
  // États locaux pour les champs de saisie
  const [serverIP, setServerIP] = useState('192.168.1.17'); // IP serveur
  const [serverPort, setServerPort] = useState('8000'); //port serveur
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // test connexion au serveur RAVE
  const testConnection = async () => {
    if (!serverIP.trim() || !serverPort.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir l\'IP et le port du serveur');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus(null);

    try {
      const url = `http://${serverIP}:${serverPort}/`;
      console.log('Test de connexion vers:', url);

      const response = await fetch(url, {
        method: 'GET',
        timeout: 5000, // 5 secondes de timeout
      });

      const data = await response.text();
      console.log('Réponse du serveur:', data);

      if (response.ok) {
        setConnectionStatus('success');
        Alert.alert(
          'Connexion réussie ! 🎉',
          `Serveur RAVE connecté\nRéponse: ${data}`,
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setConnectionStatus('error');
      Alert.alert(
        'Connexion échouée ❌',
        `Impossible de se connecter au serveur:\n${error.message}\n\nVérifiez que le serveur Python est démarré.`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Fonction pour récupérer les modèles disponibles
  const getModels = async () => {
    if (connectionStatus !== 'success') {
      Alert.alert('Erreur', 'Testez d\'abord la connexion au serveur');
      return;
    }

    try {
      const url = `http://${serverIP}:${serverPort}/getmodels`;
      const response = await fetch(url);
      const models = await response.json();

      Alert.alert(
        'Modèles RAVE disponibles 🎼',
        models.join('\n• '),
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les modèles');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎵 RAVE Audio Transfer</Text>
        <Text style={styles.subtitle}>Connexion au serveur</Text>
      </View>

      <View style={styles.form}>
        {/* Configuration IP */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse IP du serveur</Text>
          <TextInput
            style={styles.input}
            value={serverIP}
            onChangeText={setServerIP}
            placeholder="192.168.1.17"
            keyboardType="numeric"
          />
        </View>

        {/* Configuration Port */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Port du serveur</Text>
          <TextInput
            style={styles.input}
            value={serverPort}
            onChangeText={setServerPort}
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
          onPress={testConnection}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting ? '🔄 Connexion...' : '🔗 Tester la connexion'}
          </Text>
        </TouchableOpacity>

        {/* Indicateur de statut */}
        {connectionStatus && (
          <View style={[
            styles.statusIndicator,
            connectionStatus === 'success' ? styles.statusSuccess : styles.statusError
          ]}>
            <Text style={styles.statusText}>
              {connectionStatus === 'success' 
                ? '✅ Serveur connecté' 
                : '❌ Connexion échouée'
              }
            </Text>
          </View>
        )}

        {/* Bouton pour voir les modèles (seulement si connecté) */}
        {connectionStatus === 'success' && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={getModels}
          >
            <Text style={styles.secondaryButtonText}>
              📋 Voir les modèles disponibles
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  button: {
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
  },
  info: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  infoText: {
    textAlign: 'center',
    color: '#856404',
    fontSize: 14,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 4,
  },
});