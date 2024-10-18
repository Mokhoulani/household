import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import { TextInput, TextInputProps } from 'react-native-paper';
import { Text, View } from 'react-native';

interface Props<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  fieldKey: Path<T>;
  placeholder: string;
  icon?: string;
  secureText?: boolean;
  props?: TextInputProps;
}

export default function InputController<T extends FieldValues>({
  control,
  errors,
  fieldKey,
  placeholder,
  icon,
  secureText,
  props,
}: Props<T>) {
  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            label={placeholder}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            left={icon ? <TextInput.Icon icon={icon} /> : null}
            secureTextEntry={secureText ? true : false}
            error={!!errors[fieldKey]}
            {...props}
          />
        )}
        name={fieldKey}
      />
      {errors && errors[fieldKey] && (
        <Text style={{ color: 'red' }}>
          {String(errors[fieldKey]?.message)}
        </Text>
      )}
    </View>
  );
}
