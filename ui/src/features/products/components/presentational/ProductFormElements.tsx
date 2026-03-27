import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import type { Control } from 'react-hook-form';
import type { ProductFormInput } from '@/features/products/validation/productSchema';
import { FormInput } from '@/shared/components/presentational/FormInput';

interface ProductFormElementsProps {
  control: Control<ProductFormInput>;
}

export function ProductFormElements({ control }: ProductFormElementsProps) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <FormInput<ProductFormInput>
        name="name"
        control={control}
        label={t('products.name')}
      />
      <FormInput<ProductFormInput>
        name="priceCents"
        control={control}
        label={t('products.priceCents')}
        type="number"
      />
    </Stack>
  );
}
