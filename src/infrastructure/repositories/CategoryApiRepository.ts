import type { Category, CategoryCreateInput, CategoryUpdateInput } from '@/core/domain/entities/Category'
import type { CategoryRepository } from '@/core/domain/repositories/CategoryRepository'
import { axiosClient } from '@/infrastructure/http/axiosClient'

export class CategoryApiRepository implements CategoryRepository {
  async list(): Promise<Category[]> {
    const { data } = await axiosClient.get<Category[]>('/categories')
    return data
  }

  async create(payload: CategoryCreateInput): Promise<Category> {
    const { data } = await axiosClient.post<Category>('/categories', payload)
    return data
  }

  async update(payload: CategoryUpdateInput): Promise<Category> {
    const { id, ...body } = payload
    const { data } = await axiosClient.put<Category>(`/categories/${id}`, body)
    return data
  }

  async remove(categoryId: string): Promise<void> {
    await axiosClient.delete(`/categories/${categoryId}`)
  }
}