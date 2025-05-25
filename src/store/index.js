import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import des reducers (on va les créer)
import serverReducer from './serverSlice';
import recordingReducer from './recordingSlice';
import raveReducer from './raveSlice';

// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['server', 'recording'], // Seuls ces reducers seront sauvegardés
};

// Combinaison des reducers
const rootReducer = combineReducers({
  server: serverReducer,      // Gestion serveur (IP, port, connexion)
  recording: recordingReducer, // Gestion des enregistrements audio
  rave: raveReducer,          // Gestion des transformations RAVE
});

// Reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor pour la sauvegarde
export const persistor = persistStore(store);

// Types pour TypeScript (optionnel)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;