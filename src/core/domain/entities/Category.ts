export interface Category {
  id: string
  name: string
}

export interface CategoryCreateInput {
  name: string
}

export interface CategoryUpdateInput extends CategoryCreateInput {
  id: string
}