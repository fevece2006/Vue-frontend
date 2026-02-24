import { CategoryUseCases } from '@/core/application/use-cases/category/CategoryUseCases'
import { ProductUseCases } from '@/core/application/use-cases/product/ProductUseCases'
import { CategoryApiRepository } from '@/infrastructure/repositories/CategoryApiRepository'
import { ProductApiRepository } from '@/infrastructure/repositories/ProductApiRepository'

const categoryRepository = new CategoryApiRepository()
const productRepository = new ProductApiRepository()

export const categoryUseCases = new CategoryUseCases(categoryRepository)
export const productUseCases = new ProductUseCases(productRepository)