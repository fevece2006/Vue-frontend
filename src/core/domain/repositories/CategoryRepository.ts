import type { Category, CategoryCreateInput, CategoryUpdateInput } from '@/core/domain/entities/Category'

export interface CategoryRepository {
  list(): Promise<Category[]>
  create(payload: CategoryCreateInput): Promise<Category>
  update(payload: CategoryUpdateInput): Promise<Category>
  remove(categoryId: string): Promise<void>
}