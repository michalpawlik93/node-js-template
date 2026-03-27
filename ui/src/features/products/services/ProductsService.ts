import { apiClient } from '@/shared/lib/apiClient';
import { toAppError } from '@/shared/errors/mapApiError';
import type { ApiSuccessResponse } from '@/shared/types/ApiResponse';
import type { PagedResult, Pager } from '@/shared/types/Pager';
import type { CreateProductPayload, Product } from '@/features/products/types/Product';

export class ProductsService {
  private static async withErrorMapping<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw toAppError(error);
    }
  }

  static async createProduct(payload: CreateProductPayload): Promise<{ id: string }> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.post<ApiSuccessResponse<{ id: string }>>('/products', payload);
      return response.data.data;
    });
  }

  static async deleteProduct(id: string): Promise<{ id: string }> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.delete<ApiSuccessResponse<{ id: string }>>(`/products/${id}`);
      return response.data.data;
    });
  }

  static async getPagedProducts(pager: Pager): Promise<PagedResult<Product>> {
    return this.withErrorMapping(async () => {
      const response = await apiClient.post<PagedResult<Product>>('/products/search', pager);
      return response.data;
    });
  }
}
