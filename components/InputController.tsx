import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface Props<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  fieldKey: Path<T>;
  placeholder: string;
  icon?: string;
  secureText?: boolean;
  props?: TextInputProps;
}

const colors = {
  warning: '#FF0000',
};
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
        <Text style={styles.warning}>{String(errors[fieldKey]?.message)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  warning: {
    color: colors.warning,
  },
});
