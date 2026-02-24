import type { Product, ProductCreateInput, ProductUpdateInput } from '@/core/domain/entities/Product'

export interface ProductRepository {
  list(): Promise<Product[]>
  create(payload: ProductCreateInput): Promise<Product>
  update(payload: ProductUpdateInput): Promise<Product>
  remove(productId: string): Promise<void>
}