import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { raveStyles as styles } from './RaveScreen.styles';

export default function RaveScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Transformation RAVE</Text>
        <Text style={styles.subtitle}>Vue à développer...</Text>
      </View>
      
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Ici on aura :{'\n'}
          • Tabs (Assets/Records/Files){'\n'}
          • Sélection modèle RAVE{'\n'}
          • Upload/Download serveur{'\n'}
          • Lecteurs avant/après{'\n'}
          • Indicateur de progression
        </Text>
      </View>
    </View>
  );
}