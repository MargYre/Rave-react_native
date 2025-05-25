import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour tester la connexion
export const testServerConnection = createAsyncThunk(
  'server/testConnection',
  async ({ ip, port }, { rejectWithValue }) => {
    try {
      const url = `http://${ip}:${port}/`;
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.text();
      return { ip, port, message: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Action pour récupérer les modèles
export const fetchModels = createAsyncThunk(
  'server/fetchModels',
  async (_, { getState, rejectWithValue }) => {
    const { server } = getState();
    try {
      const url = `http://${server.ip}:${server.port}/getmodels`;
      const response = await fetch(url);
      const models = await response.json();
      return models;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice pour la gestion du serveur
const serverSlice = createSlice({
  name: 'server',
  initialState: {
    ip: '192.168.1.17',           // IP par défaut
    port: '8000',                 // Port par défaut
    isConnected: false,           // État de connexion
    isConnecting: false,          // En cours de connexion
    connectionMessage: '',        // Message de connexion
    models: [],                   // Modèles RAVE disponibles
    selectedModel: '',            // Modèle sélectionné
    error: null,                  // Erreur éventuelle
  },
  reducers: {
    // Mettre à jour l'IP
    setServerIP: (state, action) => {
      state.ip = action.payload;
    },
    // Mettre à jour le port
    setServerPort: (state, action) => {
      state.port = action.payload;
    },
    // Sélectionner un modèle RAVE
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    // Réinitialiser l'erreur
    clearError: (state) => {
      state.error = null;
    },
    // Déconnexion
    disconnect: (state) => {
      state.isConnected = false;
      state.connectionMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Test de connexion - en cours
      .addCase(testServerConnection.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      // Test de connexion - succès
      .addCase(testServerConnection.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.isConnected = true;
        state.connectionMessage = action.payload.message;
        state.ip = action.payload.ip;
        state.port = action.payload.port;
      })
      // Test de connexion - échec
      .addCase(testServerConnection.rejected, (state, action) => {
        state.isConnecting = false;
        state.isConnected = false;
        state.error = action.payload;
      })
      // Récupération modèles - succès
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.models = action.payload;
        if (action.payload.length > 0 && !state.selectedModel) {
          state.selectedModel = action.payload[0]; // Sélectionner le premier par défaut
        }
      })
      // Récupération modèles - échec
      .addCase(fetchModels.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { 
  setServerIP, 
  setServerPort, 
  setSelectedModel, 
  clearError, 
  disconnect 
} = serverSlice.actions;

// Export du reducer
export default serverSlice.reducer;

// Sélecteurs (pour accéder facilement aux données)
export const selectServer = (state) => state.server;
export const selectIsConnected = (state) => state.server.isConnected;
export const selectModels = (state) => state.server.models;
export const selectSelectedModel = (state) => state.server.selectedModel;