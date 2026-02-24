import type { CategoryCreateInput, CategoryUpdateInput } from '@/core/domain/entities/Category'
import type { CategoryRepository } from '@/core/domain/repositories/CategoryRepository'

export class CategoryUseCases {
  private readonly categoryRepository: CategoryRepository

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository
  }

  list() {
    return this.categoryRepository.list()
  }

  create(payload: CategoryCreateInput) {
    return this.categoryRepository.create(payload)
  }

  update(payload: CategoryUpdateInput) {
    return this.categoryRepository.update(payload)
  }

  remove(categoryId: string) {
    return this.categoryRepository.remove(categoryId)
  }
}