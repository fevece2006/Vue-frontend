import type { CategoryCreateInput, CategoryUpdateInput } from '@/core/domain/entities/Category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { categoryUseCases } from '@/infrastructure/container'
import { queryKeys } from '@/modules/shared/queryKeys'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryUseCases.list(),
  })

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CategoryCreateInput) => categoryUseCases.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: (payload: CategoryUpdateInput) => categoryUseCases.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
  })

  const removeCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => categoryUseCases.remove(categoryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
  })

  return {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    removeCategoryMutation,
  }
}