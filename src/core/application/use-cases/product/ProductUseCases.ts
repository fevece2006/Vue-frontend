import type { ProductCreateInput, ProductUpdateInput } from '@/core/domain/entities/Product'
import type { ProductRepository } from '@/core/domain/repositories/ProductRepository'

export class ProductUseCases {
  private readonly productRepository: ProductRepository

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository
  }

  list() {
    return this.productRepository.list()
  }

  create(payload: ProductCreateInput) {
    return this.productRepository.create(payload)
  }

  update(payload: ProductUpdateInput) {
    return this.productRepository.update(payload)
  }

  remove(productId: string) {
    return this.productRepository.remove(productId)
  }
}