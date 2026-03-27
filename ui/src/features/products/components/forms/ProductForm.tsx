import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import type { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import type { Control } from 'react-hook-form';
import { Button } from '@/shared/components/presentational/Button';
import {
  ProductFormElements,
} from '@/features/products/components/presentational/ProductFormElements';
import type { ProductFormInput } from '@/features/products/validation/productSchema';

interface ProductFormProps {
  control: Control<ProductFormInput>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onReset: () => void;
}

export function ProductForm({ control, isSubmitting, onSubmit, onReset }: ProductFormProps) {
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3 }}>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <ProductFormElements control={control} />
        <Stack direction="row" spacing={2}>
          <Button type="submit" disabled={isSubmitting}>
            {t('products.create')}
          </Button>
          <Button type="button" variant="outlined" onClick={onReset}>
            {t('products.reset')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
