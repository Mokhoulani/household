import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { signUpSchema, TsignUpSchema } from '../constants/schemas/SignUpSchema';
import { Field } from '../constants/types';
import AuthForm from '../components/AuthForm';

export default function SignUpScreen() {
  const fields: Field<TsignUpSchema>[] = [
    { fieldKey: 'name', placeholder: 'Enter your name', secureText: false },
    {
      fieldKey: 'email',
      placeholder: 'Enter your Email',
      secureText: false,
      icon: 'at',
    },
    {
      fieldKey: 'password',
      placeholder: 'Enter a password',
      secureText: true,
      icon: 'lock-outline',
    },
    {
      fieldKey: 'confirmPassword',
      placeholder: 'Confirm password',
      secureText: true,
      icon: 'lock-outline',
    },
  ];

  function handleSubmit(data: TsignUpSchema) {
    console.log(data);
    //hantera registrering
  }

  return (
    <SafeAreaView style={styles.page}>
      <AuthForm
        formTitle="Sign up"
        fields={fields}
        schema={signUpSchema}
        buttonText="Sign up"
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10,

    alignItems: 'center',
  },
});
