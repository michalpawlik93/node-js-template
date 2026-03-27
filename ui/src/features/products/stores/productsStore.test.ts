import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProductsStore } from './productsStore';
import { ProductsService } from '@/features/products/services/ProductsService';

vi.mock('@/features/products/services/ProductsService', () => ({
  ProductsService: {
    getPagedProducts: vi.fn(),
    createProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe('productsStore', () => {
  beforeEach(() => {
    useProductsStore.setState({
      items: [],
      cursor: undefined,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('fetches products and stores list', async () => {
    vi.mocked(ProductsService.getPagedProducts).mockResolvedValue({
      data: [{ id: 'p1', name: 'Tea', priceCents: 599 }],
      cursor: undefined,
    });

    await useProductsStore.getState().fetchProducts();

    const { items, isLoading, error } = useProductsStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('Tea');
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });
});
