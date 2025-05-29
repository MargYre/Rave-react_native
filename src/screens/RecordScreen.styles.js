import { StyleSheet } from 'react-native';

const colors = {
  primary: '#007AFF',
  primaryLight: '#4DA6FF',
  secondary: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e1e5e9',
  shadow: '#000000',
  red: '#FF3B30',
  green: '#34C759',
};

export const recordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
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

  recordingControls: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: colors.warning,
    transform: [{ scale: 1.1 }],
  },
  recordButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingTimer: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: colors.secondary,
  },

  recordingsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  
  recordingItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recordingDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playButton: {
    backgroundColor: colors.success,
  },
  deleteButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    fontSize: 16,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});