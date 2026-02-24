import type { ProductCreateInput, ProductUpdateInput } from '@/core/domain/entities/Product'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { productUseCases } from '@/infrastructure/container'
import { queryKeys } from '@/modules/shared/queryKeys'

export const useProducts = () => {
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productUseCases.list(),
  })

  const createProductMutation = useMutation({
    mutationFn: (payload: ProductCreateInput) => productUseCases.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  })

  const updateProductMutation = useMutation({
    mutationFn: (payload: ProductUpdateInput) => productUseCases.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  })

  const removeProductMutation = useMutation({
    mutationFn: (productId: string) => productUseCases.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  })

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    removeProductMutation,
  }
}