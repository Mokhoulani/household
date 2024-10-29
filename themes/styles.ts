import { StyleSheet } from 'react-native';
import { combinedLightTheme } from './theme';

// theme.js
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
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '500',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 12,
    },
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  spacer: {
    marginVertical: 10,
  },
  titleStyle: {
    fontWeight: 'bold',
    marginRight: 16,
    alignSelf: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  taskItem: {
    marginBottom: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestCard: {
    marginVertical: 8,
    borderRadius: 8,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 16,
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  nameBadge: {
    fontWeight: 'bold',
    marginRight: 16,
  },
  noAvatarText: {
    color: combinedLightTheme.colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  ownerSubtitle: {
    color: theme.colors.gold,
    fontWeight: 'bold',
  },
  memberSubtitle: {
    color: theme.colors.gray,
    fontStyle: 'italic',
  },
  errorMessage: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
    color: theme.colors.error,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: theme.colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.button.disabled,
  },
  hintText: {
    fontSize: 12,
    color: combinedLightTheme.colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: combinedLightTheme.colors.text,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },

  // Card styles
  surface: {
    margin: theme.spacing.md,
    elevation: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  card: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    padding: theme.spacing.sm,
  },
  cardTouchable: {
    marginVertical: theme.spacing.sm,
  },
  innerCard: {
    marginVertical: theme.spacing.sm,
  },

  // Typography styles
  title: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.secondary,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },

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
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.error,
  },

  // Button styles
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.button.disabled,
  },
  buttonText: {
    color: theme.colors.text.light,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },

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
  },
  avatarIcon: {
    fontSize: 30,
  },
  selectedAvatar: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },

  // Message styles
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },

  // Badge styles
  badge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  badgeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },

  // Grid styles
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
});
