import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { combinedLightTheme } from './theme';

// Define colors
export const colors = {
  primary: '#2196f3',
  error: '#d32f2f',
  gold: '#FFD700',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#757575',
  background: '#f5f5f5',
  border: '#e0e0e0',
  text: {
    primary: '#000000',
    secondary: '#757575',
    light: '#FFFFFF',
  },
  button: {
    disabled: '#cccccc',
  },
};

// Define theme
export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 30,
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: 'bold' as TextStyle['fontWeight'],
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '500' as TextStyle['fontWeight'],
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 12,
    },
  },
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } as ViewStyle,
  spacer: {
    marginVertical: 10,
  } as ViewStyle,
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  } as ViewStyle,
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  } as ViewStyle,
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  } as TextStyle,
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
  } as ViewStyle,
  retryText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    textAlign: 'center', // Ensures the text is centered
  } as TextStyle,
  contentContainer: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  requestCard: {
    marginVertical: 8,
    borderRadius: theme.borderRadius.md,
  } as ViewStyle,
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  } as ViewStyle,
  actionButton: {
    marginLeft: 8,
  } as ViewStyle,
  taskInfo: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  } as ViewStyle,
  taskItem: {
    marginBottom: 12,
  } as ViewStyle,
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
  } as TextStyle,
  cardContent: {
    padding: 20,
    alignItems: 'center',
  } as ViewStyle,
  nameBadge: {
    fontWeight: 'bold',
    marginRight: 16,
  } as TextStyle,
  noAvatarText: {
    color: combinedLightTheme.colors.text,
    textAlign: 'center',
    marginTop: 10,
  } as TextStyle,
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  } as ViewStyle,
  ownerSubtitle: {
    color: colors.gold,
    fontWeight: 'bold',
  } as TextStyle,
  memberSubtitle: {
    color: colors.gray,
    fontStyle: 'italic',
  } as TextStyle,
  errorMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: theme.colors.error, // Using theme color instead of color literal
  } as TextStyle,
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  } as ViewStyle,
  submitButtonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
  } as TextStyle,
  submitButtonDisabled: {
    backgroundColor: theme.colors.button.disabled,
  } as ViewStyle,
  hintText: {
    fontSize: 12,
    color: combinedLightTheme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  } as TextStyle,
  inputContainer: {
    marginBottom: 20,
  } as ViewStyle,
  label: {
    fontSize: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    marginBottom: 8,
    color: combinedLightTheme.colors.text,
  } as TextStyle,
  scrollContent: {
    flexGrow: 1,
  } as ViewStyle,
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  } as ViewStyle,

  // Card styles
  surface: {
    margin: theme.spacing.md,
    elevation: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  } as ViewStyle,
  card: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    padding: theme.spacing.sm,
  } as ViewStyle,
  cardTouchable: {
    marginVertical: theme.spacing.sm,
  } as ViewStyle,
  innerCard: {
    marginVertical: theme.spacing.sm,
  } as ViewStyle,

  // Typography styles
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text.primary,
  } as TextStyle,
  subtitle: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: theme.typography.subtitle.fontWeight,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.secondary,
  } as TextStyle,
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  } as TextStyle,

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    width: '100%',
    backgroundColor: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  } as TextStyle,
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  } as TextStyle,
  inputError: {
    borderColor: theme.colors.error,
  } as TextStyle,

  // Button styles
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.button.disabled,
  } as ViewStyle,
  buttonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600' as TextStyle['fontWeight'],
  } as TextStyle,

  // Avatar styles
  avatarContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    margin: theme.spacing.xs,
  } as ViewStyle,
  avatarIcon: {
    fontSize: 30,
  } as TextStyle,
  selectedAvatar: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  } as ViewStyle,

  // Message styles
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  } as TextStyle,
  emptyMessage: {
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,

  // Badge styles
  badge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  } as ViewStyle,
  badgeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  } as TextStyle,

  // Grid styles
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  } as ViewStyle,
});
