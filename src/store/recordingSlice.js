import { createSlice } from '@reduxjs/toolkit';

const recordingSlice = createSlice({
  name: 'recording',
  initialState: {
    recordings: [],          // Liste des enregistrements [{id, name, uri, duration}]
    isRecording: false,      // En train d'enregistrer ?
    currentRecording: null,  // Enregistrement en cours
    playingId: null,         // ID de l'enregistrement en lecture
  },
  reducers: {
    // Actions pour plus tard (vue Record)
    startRecording: (state) => {
      state.isRecording = true;
    },
    stopRecording: (state) => {
      state.isRecording = false;
      state.currentRecording = null;
    },
    addRecording: (state, action) => {
      state.recordings.push(action.payload);
    },
    deleteRecording: (state, action) => {
      state.recordings = state.recordings.filter(r => r.id !== action.payload);
      if (state.playingId === action.payload) {
        state.playingId = null;
      }
    },
    setPlayingId: (state, action) => {
      state.playingId = action.payload;
    },
    // Renommer un enregistrement
    renameRecording: (state, action) => {
      const { id, newName } = action.payload;
      const recording = state.recordings.find(r => r.id === id);
      if (recording) {
        recording.name = newName;
      }
    },
    
    // Nettoyer tous les enregistrements (pour debug)
    clearAllRecordings: (state) => {
      state.recordings = [];
      state.playingId = null;
    },
  },
});

export const { 
  startRecording, 
  stopRecording, 
  addRecording, 
  deleteRecording, 
  setPlayingId,
  renameRecording,
  clearAllRecordings
} = recordingSlice.actions;

export default recordingSlice.reducer;

// Sélecteurs
export const selectRecordings = (state) => state.recording.recordings;
export const selectIsRecording = (state) => state.recording.isRecording;
export const selectPlayingId = (state) => state.recording.playingId;
export const selectRecordingById = (id) => (state) => 
  state.recording.recordings.find(r => r.id === id);