import Box from '@mui/material/Box';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth/stores/authStore';
import {
  LoginForm,
} from '@/features/auth/components/presentational/LoginForm';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/validation/loginSchema';
import { toAppError } from '@/shared/errors/mapApiError';

export function LoginContainer() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [errorMessage, setErrorMessage] = useState<string>();

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(undefined);
    try {
      await login(values);
      navigate('/products', { replace: true });
    } catch (error) {
      setErrorMessage(toAppError(error).userMessage);
    }
  });

  return (
    <Box display="flex" justifyContent="center" pt={8}>
      <LoginForm
        control={control}
        errorMessage={errorMessage}
        isSubmitting={formState.isSubmitting}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
