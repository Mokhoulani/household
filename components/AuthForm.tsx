import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { ZodSchema } from 'zod';
import { Field } from '../constants/types';
import InputController from './InputController';

interface Props<T extends FieldValues> {
  fields: Field<T>[];
  schema: ZodSchema<T>;
  buttonText: string;
  formTitle: string;
  onSubmit: SubmitHandler<T>;
}

const colors = {
  background: '#000000',
};

export default function AuthForm<T extends FieldValues>({
  fields,
  schema,
  buttonText,
  formTitle,
  onSubmit,
}: Props<T>) {
  const defaultValues = Object.fromEntries(
    fields.map((field) => [field.fieldKey, '']),
  ) as DefaultValues<T>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <View style={styles.container}>
      <Surface style={styles.textSurface}>
        <Text variant="headlineLarge">{formTitle}</Text>
      </Surface>
      <View style={styles.inptFields}>
        {fields.map((field, index) => (
          <InputController
            key={index}
            control={control}
            fieldKey={field.fieldKey}
            placeholder={field.placeholder}
            errors={errors}
            secureText={field.secureText}
            icon={field.icon}
          />
        ))}
      </View>

      <Button
        labelStyle={styles.label}
        mode="elevated"
        onPress={handleSubmit(onSubmit)}>
        <Text>{buttonText}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    gap: 26,
  },
  inptFields: {
    gap: 4,
  },
  textSurface: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,
    borderRadius: 10,
  },
  label: {
    color: colors.background,
    fontWeight: 'bold',
  },
});
