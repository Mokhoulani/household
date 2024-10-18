import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthForm from '../components/AuthForm';
import { signUpSchema, TsignUpSchema } from '../constants/schemas/SignUpSchema';
import { Field } from '../constants/types';
import { signupUser } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  async function handleSubmit(data: TsignUpSchema) {
    const email = data.email;
    const password = data.password;
    const fullName = data.name;
    dispatch(signupUser({ email, password, fullName }));
  }

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
