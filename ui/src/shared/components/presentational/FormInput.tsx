import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

interface FormInputProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

export function FormInput<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  ...textFieldProps
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          {...textFieldProps}
        />
      )}
    />
  );
}
