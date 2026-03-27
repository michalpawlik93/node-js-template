import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import type { Control } from 'react-hook-form';
import type { LoginFormValues } from '@/features/auth/validation/loginSchema';
import { FormInput } from '@/shared/components/presentational/FormInput';
import { Button } from '@/shared/components/presentational/Button';

interface LoginFormProps {
  control: Control<LoginFormValues>;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function LoginForm({ control, isSubmitting, errorMessage, onSubmit }: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 4, width: 420 }}>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <Typography variant="h5">{t('auth.title')}</Typography>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        <FormInput<LoginFormValues>
          name="email"
          control={control}
          label={t('auth.email')}
          type="email"
          autoComplete="email"
        />
        <FormInput<LoginFormValues>
          name="password"
          control={control}
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
        />
        <Button type="submit" disabled={isSubmitting}>
          {t('auth.login')}
        </Button>
      </Stack>
    </Paper>
  );
}
