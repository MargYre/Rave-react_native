import { StyleSheet } from 'react-native';

// Couleurs
const colors = {
  primary: '#007AFF',
  secondary: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e1e5e9',
  shadow: '#000000',
  tabActive: '#007AFF',
  tabInactive: '#666666',
};

export const raveStyles = StyleSheet.create({
  // === LAYOUT ===
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // === HEADER ===
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // === ONGLETS ===
  tabViewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    height: 3,
  },

  // === CONTENU DES ONGLETS ===
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },

  // === LISTE DES FICHIERS ===
  fileItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fileItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f0f8ff',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // === SÉLECTION DE FICHIER ===
  selectFileButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  selectFileButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  selectedFileInfo: {
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  selectedFileName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // === ÉTATS VIDES ===
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // === SÉLECTION MODÈLE ===
  modelSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modelLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  modelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modelButton: {
    backgroundColor: colors.background,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 10,
    minWidth: '30%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  modelButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modelButtonTextSelected: {
    color: colors.white,
  },

  // === TRANSFORMATION ===
  transformSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  transformButton: {
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  transformButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  transformButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // === LECTEURS AUDIO ===
  playersSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  transformedPlayerButton: {
    backgroundColor: colors.success,
  },
  playerButtonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  playerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // === FICHIER SÉLECTIONNÉ ===
  selectedFileSection: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedFileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  selectedFileText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});