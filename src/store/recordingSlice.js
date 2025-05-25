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
    },
    addRecording: (state, action) => {
      state.recordings.push(action.payload);
    },
    deleteRecording: (state, action) => {
      state.recordings = state.recordings.filter(r => r.id !== action.payload);
    },
    setPlayingId: (state, action) => {
      state.playingId = action.payload;
    },
  },
});

export const { 
  startRecording, 
  stopRecording, 
  addRecording, 
  deleteRecording, 
  setPlayingId 
} = recordingSlice.actions;

export default recordingSlice.reducer;

// Sélecteurs
export const selectRecordings = (state) => state.recording.recordings;
export const selectIsRecording = (state) => state.recording.isRecording;