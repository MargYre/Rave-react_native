// src/screens/RaveScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useSelector, useDispatch } from 'react-redux';

// Import des actions Redux
import { selectRecordings } from '../store/recordingSlice';
import { 
  selectServer, 
  selectModels, 
  selectSelectedModel,
  setSelectedModel 
} from '../store/serverSlice';
import {
  setSelectedFile,
  setSelectedTab,
  startProcessing,
  setProcessingProgress,
  setTransformedAudio,
  resetTransformation
} from '../store/raveSlice';

// Import du composant Assets
import AssetsTab from '../components/AssetsTab';

// Import des styles
import { raveStyles as styles } from './RaveScreen.styles';

/**
 * 🎵 RaveScreen - Vue de transformation audio avec IA RAVE
 * 
 * FONCTIONNALITÉS :
 * - Sélection de fichiers via 3 onglets (Assets/Records/Files)
 * - Choix du modèle RAVE de transformation
 * - Upload vers serveur + transformation IA
 * - Download et comparaison avant/après
 */
export default function RaveScreen() {
  // === ÉTAT REDUX ===
  const dispatch = useDispatch();
  const recordings = useSelector(selectRecordings);
  const server = useSelector(selectServer);
  const models = useSelector(selectModels);
  const selectedModel = useSelector(selectSelectedModel);
  const raveState = useSelector(state => state.rave);
  
  // === ÉTAT LOCAL ===
  const [sound, setSound] = useState(null);
  const [transformedSound, setTransformedSound] = useState(null);
  const [playingOriginal, setPlayingOriginal] = useState(false);
  const [playingTransformed, setPlayingTransformed] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedFileLocal, setSelectedFileLocal] = useState(null);
  const [transformedFileUri, setTransformedFileUri] = useState(null);

  // Configuration des onglets
  const [routes] = useState([
    { key: 'assets', title: 'Assets' },
    { key: 'records', title: 'Records' },
    { key: 'files', title: 'Files' },
  ]);

  // === NETTOYAGE ===
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
      if (transformedSound) transformedSound.unloadAsync();
    };
  }, []);

  // === GESTION AUDIO ===
  const playOriginalAudio = async () => {
    try {
      if (!selectedFileLocal) {
        Alert.alert('Erreur', 'Aucun fichier sélectionné');
        return;
      }

      // Arrêter l'autre lecteur
      if (transformedSound && playingTransformed) {
        await transformedSound.stopAsync();
        setPlayingTransformed(false);
      }

      if (sound && playingOriginal) {
        // Arrêter la lecture
        await sound.stopAsync();
        setPlayingOriginal(false);
      } else {
        // Démarrer la lecture
        if (sound) await sound.unloadAsync();

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: selectedFileLocal.uri },
          { shouldPlay: true }
        );

        setSound(newSound);
        setPlayingOriginal(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlayingOriginal(false);
          }
        });
      }
    } catch (error) {
      console.log('❌ Erreur lecture original:', error);
      Alert.alert('Erreur', 'Impossible de lire le fichier original');
    }
  };

  const playTransformedAudio = async () => {
    try {
      if (!transformedFileUri) {
        Alert.alert('Erreur', 'Aucun fichier transformé disponible');
        return;
      }

      // Arrêter l'autre lecteur
      if (sound && playingOriginal) {
        await sound.stopAsync();
        setPlayingOriginal(false);
      }

      if (transformedSound && playingTransformed) {
        // Arrêter la lecture
        await transformedSound.stopAsync();
        setPlayingTransformed(false);
      } else {
        // Démarrer la lecture
        if (transformedSound) await transformedSound.unloadAsync();

        const { sound: newTransformedSound } = await Audio.Sound.createAsync(
          { uri: transformedFileUri },
          { shouldPlay: true }
        );

        setTransformedSound(newTransformedSound);
        setPlayingTransformed(true);

        newTransformedSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setPlayingTransformed(false);
          }
        });
      }
    } catch (error) {
      console.log('❌ Erreur lecture transformé:', error);
      Alert.alert('Erreur', 'Impossible de lire le fichier transformé');
    }
  };

  // === TRANSFORMATION RAVE ===
  const transformAudio = async () => {
    if (!selectedFileLocal) {
      Alert.alert('Erreur', 'Veuillez sélectionner un fichier audio');
      return;
    }

    if (!server.isConnected) {
      Alert.alert('Erreur', 'Veuillez vous connecter au serveur dans l\'onglet Home');
      return;
    }

    if (!selectedModel) {
      Alert.alert('Erreur', 'Aucun modèle RAVE sélectionné');
      return;
    }

    try {
      dispatch(startProcessing());
      console.log('🚀 Début transformation RAVE...');

      // 1. Sélectionner le modèle sur le serveur
      await selectModelOnServer(selectedModel);

      // 2. Upload du fichier
      await uploadAudioFile(selectedFileLocal);

      // 3. Download du résultat
      const transformedUri = await downloadTransformedFile();
      
      setTransformedFileUri(transformedUri);
      dispatch(setTransformedAudio(transformedUri));

      Alert.alert(
        'Transformation réussie ! 🎉',
        'Votre audio a été transformé avec succès. Vous pouvez maintenant comparer l\'original et le résultat.',
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.log('❌ Erreur transformation:', error);
      dispatch(resetTransformation());
      Alert.alert('Erreur de transformation', error.message);
    }
  };

  // Sélectionner le modèle sur le serveur
  const selectModelOnServer = async (modelName) => {
    try {
      const url = `http://${server.ip}:${server.port}/selectModel/${modelName}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur sélection modèle: ${response.status}`);
      }
      
      console.log(`✅ Modèle ${modelName} sélectionné sur le serveur`);
    } catch (error) {
      throw new Error(`Impossible de sélectionner le modèle: ${error.message}`);
    }
  };

  // Upload du fichier vers le serveur
  const uploadAudioFile = async (file) => {
    try {
      const url = `http://${server.ip}:${server.port}/upload`;
      
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      });

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur upload: ${response.status}`);
      }

      console.log('✅ Fichier uploadé avec succès');
      dispatch(setProcessingProgress(50));

      // Attendre que le serveur traite le fichier
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      throw new Error(`Erreur lors de l'upload: ${error.message}`);
    }
  };

  // Download du fichier transformé
  const downloadTransformedFile = async () => {
    try {
      const url = `http://${server.ip}:${server.port}/download`;
      
      // Créer le dossier de destination
      const transformedDir = `${FileSystem.documentDirectory}transformed/`;
      const dirInfo = await FileSystem.getInfoAsync(transformedDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(transformedDir, { intermediates: true });
      }

      // Nom du fichier de destination
      const fileName = `transformed_${Date.now()}.wav`;
      const localUri = `${transformedDir}${fileName}`;

      // Download
      const downloadResult = await FileSystem.downloadAsync(url, localUri);
      
      if (downloadResult.status !== 200) {
        throw new Error(`Erreur download: ${downloadResult.status}`);
      }

      console.log('✅ Fichier transformé téléchargé:', downloadResult.uri);
      dispatch(setProcessingProgress(100));
      
      return downloadResult.uri;
    } catch (error) {
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
  };

  // === SÉLECTION DE FICHIERS ===
  const selectFileFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileData = {
          id: Date.now().toString(),
          name: file.name,
          uri: file.uri,
          size: file.size,
          type: 'file'
        };
        
        setSelectedFileLocal(fileData);
        dispatch(setSelectedFile(fileData));
      }
    } catch (error) {
      console.log('❌ Erreur sélection fichier:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
    }
  };

  const selectRecording = (recording) => {
    const fileData = {
      ...recording,
      type: 'recording'
    };
    setSelectedFileLocal(fileData);
    dispatch(setSelectedFile(fileData));
  };

  // === RENDU DES ONGLETS ===
  const AssetsTabScreen = () => (
    <AssetsTab 
      styles={styles} 
      selectedFileLocal={selectedFileLocal} 
      setSelectedFileLocal={setSelectedFileLocal} 
    />
  );

  const RecordsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>🎤 Mes enregistrements</Text>
      {recordings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Aucun enregistrement disponible.{'\n'}
            Allez dans l'onglet Record pour en créer !
          </Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.fileItem,
                selectedFileLocal?.id === item.id && styles.fileItemSelected
              ]}
              onPress={() => selectRecording(item)}
            >
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{item.name}</Text>
                <Text style={styles.fileDetails}>
                  {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')} • {(item.size / 1024).toFixed(1)} KB
                </Text>
              </View>
              {selectedFileLocal?.id === item.id && (
                <Text style={styles.selectedIcon}>✓</Text>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const FilesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>📁 Fichiers du téléphone</Text>
      <TouchableOpacity style={styles.selectFileButton} onPress={selectFileFromFiles}>
        <Text style={styles.selectFileButtonText}>📂 Sélectionner un fichier audio</Text>
      </TouchableOpacity>
      
      {selectedFileLocal?.type === 'file' && (
        <View style={styles.selectedFileInfo}>
          <Text style={styles.selectedFileName}>✅ {selectedFileLocal.name}</Text>
        </View>
      )}
    </View>
  );

  const renderScene = SceneMap({
    assets: AssetsTabScreen,
    records: RecordsTab,
    files: FilesTab,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#007AFF"
      inactiveColor="#666666"
    />
  );

  // === RENDU PRINCIPAL ===
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Transformation RAVE</Text>
        <Text style={styles.subtitle}>
          {server.isConnected ? `Connecté • ${models.length} modèles` : 'Non connecté'}
        </Text>
      </View>

      {/* Sélection de fichiers avec onglets */}
      <View style={styles.tabViewContainer}>
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setTabIndex}
          initialLayout={{ width: 300 }}
        />
      </View>

      {/* Sélection du modèle RAVE */}
      {models.length > 0 && (
        <View style={styles.modelSection}>
          <Text style={styles.modelLabel}>🤖 Modèle RAVE :</Text>
          <View style={styles.modelButtons}>
            {models.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.modelButton,
                  selectedModel === model && styles.modelButtonSelected
                ]}
                onPress={() => dispatch(setSelectedModel(model))}
              >
                <Text style={[
                  styles.modelButtonText,
                  selectedModel === model && styles.modelButtonTextSelected
                ]}>
                  {model.charAt(0).toUpperCase() + model.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Bouton de transformation */}
      <View style={styles.transformSection}>
        <TouchableOpacity
          style={[
            styles.transformButton,
            (!selectedFileLocal || !server.isConnected || raveState.isProcessing) && styles.transformButtonDisabled
          ]}
          onPress={transformAudio}
          disabled={!selectedFileLocal || !server.isConnected || raveState.isProcessing}
        >
          {raveState.isProcessing ? (
            <View style={styles.processingContent}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.transformButtonText}>Transformation en cours...</Text>
            </View>
          ) : (
            <Text style={styles.transformButtonText}>🚀 Transformer l'audio</Text>
          )}
        </TouchableOpacity>

        {raveState.isProcessing && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progression : {raveState.processingProgress}%</Text>
          </View>
        )}
      </View>

      {/* Lecteurs audio */}
      <View style={styles.playersSection}>
        <View style={styles.playerRow}>
          <TouchableOpacity
            style={[
              styles.playerButton,
              !selectedFileLocal && styles.playerButtonDisabled
            ]}
            onPress={playOriginalAudio}
            disabled={!selectedFileLocal}
          >
            <Text style={styles.playerButtonText}>
              {playingOriginal ? '⏸️' : '▶️'} Original
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.playerButton,
              styles.transformedPlayerButton,
              !transformedFileUri && styles.playerButtonDisabled
            ]}
            onPress={playTransformedAudio}
            disabled={!transformedFileUri}
          >
            <Text style={styles.playerButtonText}>
              {playingTransformed ? '⏸️' : '▶️'} Transformé
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informations sur le fichier sélectionné */}
      {selectedFileLocal && (
        <View style={styles.selectedFileSection}>
          <Text style={styles.selectedFileTitle}>📄 Fichier sélectionné :</Text>
          <Text style={styles.selectedFileText}>{selectedFileLocal.name}</Text>
        </View>
      )}
    </View>
  );
}