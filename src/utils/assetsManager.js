// Liste des fichiers audio par défaut
export const getDefaultAssets = () => {
    return [
      {
        id: 'asset_piano',
        name: 'Sample Piano',
        uri: require('../../assets/audio/piano_sample.mp3'),
        duration: 5,
        size: 50000,
        type: 'asset',
        description: 'Mélodie de piano courte pour test'
      },
      {
        id: 'asset_vocal', 
        name: 'Sample Vocal',
        uri: require('../../assets/audio/vocal_sample.mp3'),
        duration: 3,
        size: 30000,
        type: 'asset',
        description: 'Échantillon vocal pour transformation'
      }
    ];
  };
  
  /*Vérifie si les assets sont disponibles*/
  export const areAssetsAvailable = () => {
    const assets = getDefaultAssets();
    return assets.some(asset => asset.uri !== null);
  };
  
  /* Filtre les assets disponibles (qui ont un uri valide)*/
  export const getAvailableAssets = () => {
    return getDefaultAssets().filter(asset => asset.uri !== null);
  };
  
  /*Trouve un asset par son ID*/
  export const getAssetById = (id) => {
    return getDefaultAssets().find(asset => asset.id === id);
  };
  
  /*Formatage de la durée pour l'affichage*/
  export const formatAssetDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  /*Formatage de la taille de fichier*/
  export const formatAssetSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };