import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useColors = () => {
  const theme = useTheme();

  return {
    primary: theme.colors.primary,
    onPrimary: theme.colors.onPrimary,
    primaryContainer: theme.colors.primaryContainer,
    onPrimaryContainer: theme.colors.onPrimaryContainer,
    secondary: theme.colors.secondary,
    onSecondary: theme.colors.onSecondary,
    secondaryContainer: theme.colors.secondaryContainer,
    onSecondaryContainer: theme.colors.onSecondaryContainer,
    tertiary: theme.colors.tertiary,
    tertiaryContainer: theme.colors.tertiaryContainer,
    onTertiaryContainer: theme.colors.onTertiaryContainer,
    error: theme.colors.error,
    text: {
      primary: theme.colors.surface,
      secondary: theme.colors.surfaceVariant,
      light: theme.colors.outline,
    },
    button: {
      disabled: theme.colors.surfaceDisabled,
    },
  };
};

export const useGlobalStyles = () => {
  const colors = useColors();

  const theme = {
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

  return StyleSheet.create({
    // Layout styles
    container: {
      flex: 1,
      backgroundColor: colors.primaryContainer,
    } as ViewStyle,
    containerInput: {
      flex: 1,
      padding: 16,
    } as ViewStyle,
    containerLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containerError: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containerEmpty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containerSuccess: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containerSuccessContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    containerSuccessContentText: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      textAlign: 'center',
    } as TextStyle,
    containerSuccessContentButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.sm,
    } as ViewStyle,
    containerSuccessContentButtonText: {
      color: colors.text.light,
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      textAlign: 'center',
    } as TextStyle,
    // Spacer styles
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
      color: colors.text.secondary,
      textAlign: 'center',
    } as TextStyle,
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.sm,
    } as ViewStyle,
    retryText: {
      color: colors.text.light,
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      textAlign: 'center',
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
      color: colors.text.primary,
      textAlign: 'center',
      marginTop: 10,
    } as TextStyle,
    messageContainer: {
      padding: 20,
      alignItems: 'center',
    } as ViewStyle,
    ownerSubtitle: {
      color: colors.secondary,
      fontWeight: 'bold',
    } as TextStyle,
    memberSubtitle: {
      color: colors.text.secondary,
      fontStyle: 'italic',
    } as TextStyle,
    errorMessage: {
      textAlign: 'center',
      marginVertical: 10,
      fontSize: 16,
      color: colors.error,
    } as TextStyle,
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: 15,
      width: '100%',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    } as ViewStyle,
    submitButtonText: {
      color: colors.text.light,
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
    } as TextStyle,
    submitButtonDisabled: {
      backgroundColor: colors.button.disabled,
    } as ViewStyle,
    hintText: {
      fontSize: 12,
      color: colors.text.secondary,
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
      color: colors.text.primary,
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
      backgroundColor: colors.primaryContainer,
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
      color: colors.text.primary,
    } as TextStyle,
    subtitle: {
      fontSize: theme.typography.subtitle.fontSize,
      fontWeight: theme.typography.subtitle.fontWeight,
      marginBottom: theme.spacing.sm,
      color: colors.text.secondary,
    } as TextStyle,
    description: {
      fontSize: theme.typography.body.fontSize,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    } as TextStyle,

    // Input styles
    input: {
      borderWidth: 1,
      borderColor: colors.text.secondary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      marginVertical: theme.spacing.xs,
      width: '100%',
      backgroundColor: colors.primaryContainer,
      fontSize: theme.typography.body.fontSize,
      color: colors.text.primary,
    } as TextStyle,
    multilineInput: {
      minHeight: 100,
      textAlignVertical: 'top',
    } as TextStyle,
    inputError: {
      borderColor: colors.error,
    } as TextStyle,

    // Button styles
    button: {
      backgroundColor: colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      width: '100%',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    } as ViewStyle,
    buttonDisabled: {
      backgroundColor: colors.button.disabled,
    } as ViewStyle,
    buttonText: {
      color: colors.text.light,
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
      borderColor: colors.text.secondary,
      margin: theme.spacing.xs,
    } as ViewStyle,
    avatarIcon: {
      fontSize: 30,
    } as TextStyle,
    selectedAvatar: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    } as ViewStyle,

    // Message styles
    errorText: {
      color: colors.error,
      fontSize: theme.typography.caption.fontSize,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    } as TextStyle,
    emptyMessage: {
      textAlign: 'center',
      marginVertical: theme.spacing.lg,
      fontSize: theme.typography.body.fontSize,
      color: colors.text.secondary,
    } as TextStyle,

    // Badge styles
    badge: {
      backgroundColor: colors.secondaryContainer,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    } as ViewStyle,
    badgeText: {
      fontSize: theme.typography.caption.fontSize,
      color: colors.text.secondary,
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
};
