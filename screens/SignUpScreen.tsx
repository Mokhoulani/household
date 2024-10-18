import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signupUser } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const dispatch = useAppDispatch();

  const handleSignup = async () => {
    dispatch(signupUser({ email, password, fullName }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>SignupScreen</Text>
      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Enter full name"
        value={fullName}
        onChangeText={setFullName}
        clearTextOnFocus
        style={styles.input}
      />
      <Button
        title="Signup"
        onPress={handleSignup} // Incorrectly invoking the function
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
