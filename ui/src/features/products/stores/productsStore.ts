import { create } from 'zustand';
import { ProductsService } from '@/features/products/services/ProductsService';
import type { CreateProductPayload, Product } from '@/features/products/types/Product';
import type { AppError } from '@/shared/errors/AppError';
import { toAppError } from '@/shared/errors/mapApiError';

interface ProductsState {
  items: Product[];
  cursor?: string;
  isLoading: boolean;
  error: AppError | null;
  fetchProducts: (cursor?: string) => Promise<void>;
  createProduct: (payload: CreateProductPayload) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 20;

export const useProductsStore = create<ProductsState>((set, get) => ({
  items: [],
  cursor: undefined,
  isLoading: false,
  error: null,
  fetchProducts: async (cursor) => {
    set({ isLoading: true, error: null });
    try {
      const result = await ProductsService.getPagedProducts({
        pageSize: DEFAULT_PAGE_SIZE,
        cursor,
      });
      set({
        items: result.data,
        cursor: result.cursor,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: toAppError(error),
      });
    }
  },
  createProduct: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await ProductsService.createProduct(payload);
      await get().fetchProducts();
    } catch (error) {
      set({
        isLoading: false,
        error: toAppError(error),
      });
    }
  },
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await ProductsService.deleteProduct(id);
      await get().fetchProducts();
    } catch (error) {
      set({
        isLoading: false,
        error: toAppError(error),
      });
    }
  },
}));
