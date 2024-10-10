module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'react-hooks',
    'react-native',
    '@typescript-eslint',
    'prettier',
    'jest', // Add jest plugin here
  ],
  env: {
    'jest/globals': true, // This should now be recognized
  },
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/split-platform-components': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react/react-in-jsx-scope': 'off', // If you're using React 17+ or Next.js
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
