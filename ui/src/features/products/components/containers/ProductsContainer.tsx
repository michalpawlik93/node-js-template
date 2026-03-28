import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { ProductForm } from '@/features/products/components/forms/ProductForm';
import { ProductsTable } from '@/features/products/components/presentational/ProductsTable';
import { useProductsStore } from '@/features/products/stores/productsStore';
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '@/features/products/validation/productSchema';
import { Loader } from '@/shared/components/presentational/Loader';

export function ProductsContainer() {
  const { t } = useTranslation();
  const { items, isLoading, error, fetchProducts, createProduct, deleteProduct } = useProductsStore(
    useShallow((state) => ({
      items: state.items,
      isLoading: state.isLoading,
      error: state.error,
      fetchProducts: state.fetchProducts,
      createProduct: state.createProduct,
      deleteProduct: state.deleteProduct,
    })),
  );

  const { control, handleSubmit, reset, formState } = useForm<
    ProductFormInput,
    undefined,
    ProductFormValues
  >({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      priceCents: 100,
    },
  });

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const onSubmit = handleSubmit(async (values) => {
    await createProduct({
      name: values.name,
      priceCents: Number(values.priceCents),
    });
    reset({ name: '', priceCents: 100 });
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h5">{t('products.title')}</Typography>
      {error ? <Alert severity="error">{error.userMessage}</Alert> : null}
      <ProductForm
        control={control}
        isSubmitting={formState.isSubmitting || isLoading}
        onSubmit={onSubmit}
        onReset={() => reset()}
      />
      {isLoading ? <Loader /> : <ProductsTable products={items} onDelete={(id) => void deleteProduct(id)} />}
    </Stack>
  );
}
