import { StyleSheet } from 'react-native';

const colors = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  success: '#28a745',
  successLight: '#d4edda',
  error: '#dc3545',
  errorLight: '#f8d7da',
  warning: '#ffc107',
  warningLight: '#fff3cd',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#856404',
  border: '#e1e5e9',
  inputBackground: '#f8f9fa',
  shadow: '#000000',
  debug: '#f0f0f0',
};

const spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 25,
  xxl: 30,
  xxxl: 40,
};

const borderRadius = {
  sm: 5,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 15,
};

// Styles du composant HomeScreen
export const homeStyles = StyleSheet.create({
  // === LAYOUT ===
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  
  // === HEADER ===
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // === FORMULAIRE ===
  form: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // === BOUTONS ===
  button: {
    borderRadius: borderRadius.lg,
    padding: 18,
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonHover: {
    backgroundColor: colors.primaryDark,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // === INDICATEURS DE STATUT ===
  statusIndicator: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // === SECTION INFO ===
  info: {
    marginTop: spacing.xxxl,
    padding: spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  infoText: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 14,
    lineHeight: 20,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 4,
    borderRadius: 3,
  },

  // === DEBUG (développement uniquement) ===
  debug: {
    marginTop: spacing.lg,
    padding: spacing.sm,
    backgroundColor: colors.debug,
    borderRadius: borderRadius.sm,
  },
  debugText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export { colors, spacing, borderRadius };