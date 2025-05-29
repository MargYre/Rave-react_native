// src/screens/RecordScreen.js - Version avec import de styles
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useSelector, useDispatch } from 'react-redux';

import {
  startRecording as startRecordingAction,
  stopRecording as stopRecordingAction,
  addRecording,
  deleteRecording,
  setPlayingId,
  selectRecordings,
  selectIsRecording
} from '../store/recordingSlice';

// Import des styles séparés
import { recordStyles as styles } from './RecordScreen.styles';

export default function RecordScreen() {
  // === ÉTAT REDUX ===
  const dispatch = useDispatch();
  const recordings = useSelector(selectRecordings);
  const isRecordingRedux = useSelector(selectIsRecording);
  const playingId = useSelector(state => state.recording.playingId);
  
  // === ÉTAT LOCAL ===
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingName, setRecordingName] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [pendingRecordingUri, setPendingRecordingUri] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  // === CONFIGURATION AUDIO ===
  useEffect(() => {
    configureAudio();
    return () => {
      if (sound) sound.unloadAsync();
      if (recording) recording.stopAndUnloadAsync();
    };
  }, []);

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
      console.log('❌ Erreur configuration audio:', error);
    }
  };

  // === ENREGISTREMENT ===
  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('📋 Demande de permission micro...');
        const permission = await requestPermission();
        if (permission.status !== 'granted') {
          Alert.alert('Permission requise', 'L\'accès au microphone est nécessaire');
          return;
        }
      }

      console.log('🔴 Démarrage enregistrement...');
      
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
        },
      };

      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(newRecording);
      dispatch(startRecordingAction());
      
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setRecordingDuration(Math.floor(status.durationMillis / 1000));
        }
      });

      console.log('✅ Enregistrement démarré');
    } catch (error) {
      console.log('❌ Erreur démarrage:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      console.log('⏹️ Arrêt enregistrement...');
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      setRecording(null);
      setRecordingDuration(0);
      dispatch(stopRecordingAction());

      console.log('✅ Enregistrement arrêté, URI:', uri);

      if (uri) {
        setPendingRecordingUri(uri);
        setRecordingName(`Enregistrement ${recordings.length + 1}`);
        setShowSaveModal(true);
      }
    } catch (error) {
      console.log('❌ Erreur arrêt:', error);
      Alert.alert('Erreur', 'Problème lors de l\'arrêt');
    }
  };

  // === SAUVEGARDE ===
  const saveRecording = async () => {
    if (!pendingRecordingUri || !recordingName.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un nom pour l\'enregistrement');
      return;
    }

    try {
      console.log('💾 Sauvegarde de l\'enregistrement...');
      
      const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
      const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
      }

      const fileName = `${Date.now()}_${recordingName.replace(/[^a-z0-9]/gi, '_')}.m4a`;
      const finalUri = `${recordingsDir}${fileName}`;

      await FileSystem.copyAsync({
        from: pendingRecordingUri,
        to: finalUri
      });

      const fileInfo = await FileSystem.getInfoAsync(finalUri);
      
      const newRecording = {
        id: Date.now().toString(),
        name: recordingName.trim(),
        uri: finalUri,
        duration: recordingDuration,
        size: fileInfo.size,
        createdAt: new Date().toISOString(),
      };

      dispatch(addRecording(newRecording));
      console.log('✅ Enregistrement sauvé:', newRecording);

      await deleteRecordingFile(pendingRecordingUri);
      setPendingRecordingUri(null);
      setRecordingName('');
      setShowSaveModal(false);

      Alert.alert('Succès !', `Enregistrement "${recordingName}" sauvegardé`);
    } catch (error) {
      console.log('❌ Erreur sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder l\'enregistrement');
    }
  };

  const cancelSave = async () => {
    if (pendingRecordingUri) {
      await deleteRecordingFile(pendingRecordingUri);
    }
    setPendingRecordingUri(null);
    setRecordingName('');
    setShowSaveModal(false);
  };

  // === LECTURE ===
  const playRecording = async (recordingItem) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        dispatch(setPlayingId(null));
      }

      console.log('▶️ Lecture:', recordingItem.name);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingItem.uri },
        { shouldPlay: true }
      );

      setSound(newSound);
      dispatch(setPlayingId(recordingItem.id));

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          dispatch(setPlayingId(null));
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.log('❌ Erreur lecture:', error);
      Alert.alert('Erreur', 'Impossible de lire l\'enregistrement');
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      dispatch(setPlayingId(null));
    }
  };

  // === SUPPRESSION ===
  const handleDeleteRecording = (recordingItem) => {
    Alert.alert(
      'Supprimer l\'enregistrement',
      `Supprimer "${recordingItem.name}" ?`,
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

  const confirmDelete = async (recordingItem) => {
    try {
      await deleteRecordingFile(recordingItem.uri);
      dispatch(deleteRecording(recordingItem.id));
      
      if (sound) await stopPlayback();
      
      console.log('✅ Enregistrement supprimé:', recordingItem.name);
    } catch (error) {
      console.log('❌ Erreur suppression:', error);
      Alert.alert('Erreur', 'Impossible de supprimer');
    }
  };

  const deleteRecordingFile = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.log('❌ Erreur suppression fichier:', error);
    }
  };

  // === FORMATAGE ===
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // === RENDU ITEM ===
  const renderRecordingItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    
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

  // === RENDU PRINCIPAL ===
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Enregistrement Audio</Text>
        <Text style={styles.subtitle}>
          {recordings.length} enregistrement{recordings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Contrôles d'enregistrement */}
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

      {/* Modal de sauvegarde */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelSave}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💾 Sauvegarder l'enregistrement</Text>
            
            <TextInput
              style={styles.modalInput}
              value={recordingName}
              onChangeText={setRecordingName}
              placeholder="Nom de l'enregistrement"
              maxLength={50}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelSave}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveRecording}
              >
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}