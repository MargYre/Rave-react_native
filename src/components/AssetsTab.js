import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import { setSelectedFile } from '../store/raveSlice';
import { 
  getDefaultAssets, 
  areAssetsAvailable, 
  formatAssetDuration, 
  formatAssetSize 
} from '../utils/assetsManager';

/*AssetsTab - Onglet de sélection des fichiers par défaut*/
const AssetsTab = ({ styles, selectedFileLocal, setSelectedFileLocal }) => {
  const dispatch = useDispatch();
  const assets = getDefaultAssets();
  const hasAssets = areAssetsAvailable();

  const selectAsset = (asset) => {
    const fileData = {
      ...asset,
      type: 'asset'
    };
    setSelectedFileLocal(fileData);
    dispatch(setSelectedFile(fileData));
  };

  // Si aucun asset n'est disponible, afficher un message
  if (!hasAssets) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>🎼 Sons par défaut</Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            Fichiers audio par défaut à ajouter{'\n'}
            {'\n'}
            📁 Ajoutez vos fichiers dans :{'\n'}
            assets/audio/
            {'\n'}
            {'\n'}
            Formats supportés : MP3, WAV, M4A
          </Text>
        </View>
        
        {/* Aperçu de ce qui sera disponible */}
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>🔮 Aperçu (fichiers à ajouter) :</Text>
          {assets.map((asset) => (
            <View key={asset.id} style={[styles.fileItem, styles.previewItem]}>
              <View style={styles.fileInfo}>
                <Text style={[styles.fileName, styles.previewFileName]}>
                  {asset.name}
                </Text>
                <Text style={styles.fileDetails}>
                  {formatAssetDuration(asset.duration)} • {formatAssetSize(asset.size)}
                </Text>
                <Text style={styles.assetDescription}>
                  {asset.description}
                </Text>
              </View>
              <Text style={styles.previewIcon}>📁</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Si des assets sont disponibles, les afficher
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>🎼 Sons par défaut</Text>
      <FlatList
        data={assets.filter(asset => asset.uri !== null)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.fileItem,
              selectedFileLocal?.id === item.id && styles.fileItemSelected
            ]}
            onPress={() => selectAsset(item)}
          >
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item.name}</Text>
              <Text style={styles.fileDetails}>
                {formatAssetDuration(item.duration)} • {formatAssetSize(item.size)}
              </Text>
              {item.description && (
                <Text style={styles.assetDescription}>{item.description}</Text>
              )}
            </View>
            {selectedFileLocal?.id === item.id && (
              <Text style={styles.selectedIcon}>✓</Text>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AssetsTab;