import type { Product, ProductCreateInput, ProductUpdateInput } from '@/core/domain/entities/Product'
import type { ProductRepository } from '@/core/domain/repositories/ProductRepository'
import { axiosClient } from '@/infrastructure/http/axiosClient'

export class ProductApiRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    const { data } = await axiosClient.get<Product[]>('/products')
    return data
  }

  async create(payload: ProductCreateInput): Promise<Product> {
    const { data } = await axiosClient.post<Product>('/products', payload)
    return data
  }

  async update(payload: ProductUpdateInput): Promise<Product> {
    const { id, ...body } = payload
    const { data } = await axiosClient.put<Product>(`/products/${id}`, body)
    return data
  }

  async remove(productId: string): Promise<void> {
    await axiosClient.delete(`/products/${productId}`)
  }
}