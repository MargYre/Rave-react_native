import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useSelector, useDispatch } from 'react-redux';

// Import des actions Redux
import {
  startRecording as startRecordingAction,
  stopRecording as stopRecordingAction,
  addRecording,
  deleteRecording,
  setPlayingId,
  selectRecordings,
  selectIsRecording
} from '../store/recordingSlice';

// Import des styles
import { recordStyles as styles } from './RecordScreen.styles';

/**
 * RecordScreen - Vue d'enregistrement audio
 * 
 * FONCTIONNALITÉS :
 * - Enregistrement audio avec le micro
 * - Sauvegarde persistante des fichiers
 * - Liste des enregistrements avec play/pause
 * - Suppression des enregistrements
 * - Nommage personnalisé
 */
export default function RecordScreen() {
  // === ÉTAT REDUX ===
  const dispatch = useDispatch();
  const recordings = useSelector(selectRecordings);
  const isRecordingRedux = useSelector(selectIsRecording);
  
  // === ÉTAT LOCAL ===
  const [recording, setRecording] = useState(null);          // Instance d'enregistrement Expo
  const [sound, setSound] = useState(null);                  // Instance de lecture
  const [recordingName, setRecordingName] = useState('');    // Nom pour sauvegarder
  const [recordingDuration, setRecordingDuration] = useState(0); // Durée en cours
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // === EFFECTS ===
  
  /**
   * Configuration audio au montage du composant
   */
  useEffect(() => {
    configureAudio();
    return () => {
      // Nettoyage à la destruction du composant
      if (sound) {
        sound.unloadAsync();
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  /**
   * Configuration du mode audio
   */
  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.log('Erreur configuration audio:', error);
    }
  };

  // === HANDLERS D'ENREGISTREMENT ===

  /**
   *  Démarrer l'enregistrement
   */
  const startRecording = async () => {
    try {
      // Vérifier les permissions
      if (permissionResponse?.status !== 'granted') {
        console.log('📋 Demande de permission micro...');
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          Alert.alert('Permission requise', 'L\'accès au microphone est nécessaire pour enregistrer');
          return;
        }
      }

      console.log('🔴 Démarrage enregistrement...');
      
      // Configuration de l'enregistrement
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      // Créer et démarrer l'enregistrement
      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      dispatch(startRecordingAction());
      
      // Suivre la durée
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setRecordingDuration(Math.floor(status.durationMillis / 1000));
        }
      });

      console.log('Enregistrement démarré');
    } catch (error) {
      console.log('Erreur démarrage enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  /*Arrêter l'enregistrement*/
  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('Arrêt enregistrement...');
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);
      setRecordingDuration(0);
      dispatch(stopRecordingAction());

      console.log('Enregistrement arrêté, URI:', uri);

      // Proposer de sauvegarder
      if (uri) {
        Alert.alert(
          'Enregistrement terminé',
          'Voulez-vous sauvegarder cet enregistrement ?',
          [
            { text: 'Supprimer', style: 'destructive', onPress: () => deleteRecordingFile(uri) },
            { text: 'Sauvegarder', onPress: () => showSaveDialog(uri) }
          ]
        );
      }
    } catch (error) {
      console.log('Erreur arrêt enregistrement:', error);
      Alert.alert('Erreur', 'Problème lors de l\'arrêt de l\'enregistrement');
    }
  };

  /*Afficher le dialogue de sauvegarde*/
  const showSaveDialog = (uri) => {
    Alert.prompt(
      'Sauvegarder l\'enregistrement',
      'Donnez un nom à votre enregistrement :',
      [
        { text: 'Annuler', style: 'cancel', onPress: () => deleteRecordingFile(uri) },
        { 
          text: 'Sauvegarder', 
          onPress: (name) => saveRecording(uri, name || `Enregistrement ${recordings.length + 1}`)
        }
      ],
      'plain-text',
      `Enregistrement ${recordings.length + 1}`
    );
  };

  /*Sauvegarder l'enregistrement*/
  const saveRecording = async (tempUri, name) => {
    try {
      // Créer le dossier de stockage s'il n'existe pas
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      }

      // Nom de fichier unique
      const fileName = `${Date.now()}_${name.replace(/[^a-z0-9]/gi, '_')}.m4a`;
      const finalUri = `${recordingsDir}${fileName}`;

      // Copier le fichier temporaire vers le stockage permanent
      await FileSystem.copyAsync({
        from: tempUri,
        to: finalUri
      });

      // Obtenir des infos sur le fichier
      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      
      // Créer l'objet d'enregistrement
      const newRecording = {
        id: Date.now().toString(),
        name: name,
        uri: finalUri,
        duration: recordingDuration,
        size: fileInfo.size,
        createdAt: new Date().toISOString(),
      };

      // Ajouter au store Redux
      dispatch(addRecording(newRecording));

      console.log('Enregistrement sauvé:', newRecording);
      Alert.alert('Succès', `Enregistrement "${name}" sauvegardé !`);

      // Supprimer le fichier temporaire
      await deleteRecordingFile(tempUri);
    } catch (error) {
      console.log('Erreur sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'enregistrement');
    }
  };

  //  HANDLERS DE LECTURE
  /* Lire un enregistrement*/
  const playRecording = async (recordingItem) => {
    try {
      // Arrêter la lecture précédente
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        dispatch(setPlayingId(null));
      }

      console.log('▶️ Lecture:', recordingItem.name);
      
      // Créer et démarrer la nouvelle lecture
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingItem.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      dispatch(setPlayingId(recordingItem.id));

      // Arrêter automatiquement à la fin
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          dispatch(setPlayingId(null));
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.log('Erreur lecture:', error);
      Alert.alert('Erreur', 'Impossible de lire l\'enregistrement');
    }
  };

  /*Arrêter la lecture*/
  const stopPlayback = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      dispatch(setPlayingId(null));
    }
  };

  //  HANDLERS DE GESTION
  /* Supprimer un enregistrement*/
  const handleDeleteRecording = (recordingItem) => {
    Alert.alert(
      'Supprimer l\'enregistrement',
      `Êtes-vous sûr de vouloir supprimer "${recordingItem.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => confirmDelete(recordingItem)
        }
      ]
    );
  };

  /*Confirmer la suppression*/
  const confirmDelete = async (recordingItem) => {
    try {
      // Supprimer le fichier
      await deleteRecordingFile(recordingItem.uri);
      
      // Supprimer du store
      dispatch(deleteRecording(recordingItem.id));
      
      // Arrêter la lecture si c'est le fichier en cours
      if (sound) {
        await stopPlayback();
      }

      console.log('Enregistrement supprimé:', recordingItem.name);
    } catch (error) {
      console.log('Erreur suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer l\'enregistrement');
    }
  };

  /**Supprimer un fichier*/
  const deleteRecordingFile = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.log('Erreur suppression fichier:', error);
    }
  };

  // === FORMATAGE ===
  /*Formater la durée en MM:SS*/
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /* Formater la taille de fichier*/
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // === RENDU DES ÉLÉMENTS ===

  /*Rendu d'un élément de la liste*/
  const renderRecordingItem = ({ item }) => {
    const isPlaying = useSelector(state => state.recording.playingId === item.id);
    
    return (
      <View style={styles.recordingItem}>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName}>{item.name}</Text>
          <Text style={styles.recordingDetails}>
            {formatDuration(item.duration)} • {formatFileSize(item.size)}
          </Text>
        </View>
        
        <View style={styles.recordingActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.playButton]}
            onPress={() => isPlaying ? stopPlayback() : playRecording(item)}
          >
            <Text style={styles.actionButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteRecording(item)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Enregistrement Audio</Text>
        <Text style={styles.subtitle}>
          {recordings.length} enregistrement{recordings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Interface d'enregistrement */}
      <View style={styles.recordingControls}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecordingRedux && styles.recordButtonActive
          ]}
          onPress={isRecordingRedux ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecordingRedux ? '⏹️ STOP' : '🔴 REC'}
          </Text>
        </TouchableOpacity>
        
        {isRecordingRedux && (
          <Text style={styles.recordingTimer}>
            🔴 {formatDuration(recordingDuration)}
          </Text>
        )}
      </View>

      {/* Liste des enregistrements */}
      <View style={styles.recordingsList}>
        <Text style={styles.sectionTitle}>📂 Mes enregistrements</Text>
        
        {recordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Aucun enregistrement pour le moment.{'\n'}
              Appuyez sur REC pour commencer !
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            renderItem={renderRecordingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}