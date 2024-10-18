import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthForm from '../components/AuthForm';
import { signinUser } from '../store/auth/action';
import { useAppDispatch } from '../store/hook';
import { Field } from '../constants/types';
import { TsignInSchema, signInSchema } from '../constants/schemas/SignInSchema';

export default function SignInScreen() {
  const dispatch = useAppDispatch();

  const handleSignup = async (data: TsignInSchema) => {
    const email = data.email;
    const password = data.password;
    dispatch(signinUser({ email, password }));
  };

  const fields: Field<TsignInSchema>[] = [
    {
      fieldKey: 'email',
      placeholder: 'Enter your Email',
      secureText: false,
      icon: 'at',
    },
    {
      fieldKey: 'password',
      placeholder: 'Enter your password',
      secureText: true,
      icon: 'lock-outline',
    },
  ];

  return (
    <SafeAreaView style={styles.page}>
      <AuthForm
        fields={fields}
        schema={signInSchema}
        buttonText="Sign in"
        formTitle="Sign in"
        onSubmit={handleSignup}
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
