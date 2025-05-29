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
    const url = `http://${server.ip}:${server.port}/getmodels`;
    
    try {
      console.log('📋 Récupération modèles depuis:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 Réponse brute du serveur:', data);
      let models;
      if (data.models && Array.isArray(data.models)) {
        models = data.models;
      } else if (Array.isArray(data)) {
        // Au cas où le serveur renverrait directement un tableau
        models = data;
      } else {
        throw new Error(`Format de réponse inattendu: ${JSON.stringify(data)}`);
      }
      
      // Nettoyer les noms des modèles (enlever .onnx)
      const cleanModels = models.map(model => 
        model.replace('.onnx', '').toLowerCase()
      );
      
      console.log('Modèles nettoyés:', cleanModels);
      return cleanModels;
    } catch (error) {
      console.log('Erreur récupération modèles:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Slice pour la gestion du serveur
const serverSlice = createSlice({
  name: 'server',
  initialState: {
    ip: '192.168.1.17',           
    port: '8000',                 
    isConnected: false,           
    isConnecting: false,          
    connectionMessage: '',        
    models: [],                   
    selectedModel: '',            
    error: null,                  
    isFetchingModels: false,      
  },
  reducers: {
    setServerIP: (state, action) => {
      state.ip = action.payload;
    },
    setServerPort: (state, action) => {
      state.port = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.connectionMessage = '';
      state.models = [];
      state.selectedModel = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Test de connexion
      .addCase(testServerConnection.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(testServerConnection.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.isConnected = true;
        state.connectionMessage = action.payload.message;
        state.ip = action.payload.ip;
        state.port = action.payload.port;
      })
      .addCase(testServerConnection.rejected, (state, action) => {
        state.isConnecting = false;
        state.isConnected = false;
        state.error = action.payload;
      })
      
      // Récupération modèles
      .addCase(fetchModels.pending, (state) => {
        state.isFetchingModels = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.isFetchingModels = false;
        state.models = action.payload;
        
        // Sélectionner le premier modèle par défaut
        if (action.payload.length > 0 && !state.selectedModel) {
          state.selectedModel = action.payload[0];
        }
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.isFetchingModels = false;
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

// Sélecteurs
export const selectServer = (state) => state.server;
export const selectIsConnected = (state) => state.server.isConnected;
export const selectModels = (state) => state.server.models;
export const selectSelectedModel = (state) => state.server.selectedModel;
export const selectIsFetchingModels = (state) => state.server.isFetchingModels;