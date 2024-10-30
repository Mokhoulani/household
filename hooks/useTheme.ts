// useTheme.js
import { useSelector } from 'react-redux';
import { selectAvatarTheme, selectColorMode } from '../store/theme/selectors';
import { getCombinedTheme } from '../themes/theme';

export const useTheme = () => {
  const colorMode = useSelector(selectColorMode);
  const avatarTheme = useSelector(selectAvatarTheme);

  const isDark = colorMode === 'dark';

  return getCombinedTheme(avatarTheme, isDark);
};
