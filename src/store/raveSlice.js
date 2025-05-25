import { createSlice } from '@reduxjs/toolkit';

const raveSlice = createSlice({
  name: 'rave',
  initialState: {
    selectedFile: null,        // Fichier sélectionné pour transformation
    originalAudio: null,       // Audio original
    transformedAudio: null,    // Audio transformé par RAVE
    isProcessing: false,       // En cours de transformation ?
    processingProgress: 0,     // Progression (0-100%)
    selectedTab: 0,            // Onglet sélectionné (0: Assets, 1: Records, 2: Files)
  },
  reducers: {
    // Actions pour plus tard (vue RAVE)
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    startProcessing: (state) => {
      state.isProcessing = true;
      state.processingProgress = 0;
    },
    setProcessingProgress: (state, action) => {
      state.processingProgress = action.payload;
    },
    setTransformedAudio: (state, action) => {
      state.transformedAudio = action.payload;
      state.isProcessing = false;
    },
    resetTransformation: (state) => {
      state.originalAudio = null;
      state.transformedAudio = null;
      state.isProcessing = false;
      state.processingProgress = 0;
    },
  },
});

export const { 
  setSelectedFile,
  setSelectedTab,
  startProcessing,
  setProcessingProgress,
  setTransformedAudio,
  resetTransformation
} = raveSlice.actions;

export default raveSlice.reducer;