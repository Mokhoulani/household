import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { signinUser } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleSignup = async () => {
    dispatch(signinUser({ email, password }));
  };

  return (
    <View style={styles.container}>
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
      <Button
        title="Signup"
        onPress={handleSignup} // Incorrectly invoking the function
      />
    </View>
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
