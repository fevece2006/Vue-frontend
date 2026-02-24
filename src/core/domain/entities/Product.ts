export interface Product {
  id: string
  name: string
  description?: string
  price: number
  categoryId: string
}

export interface ProductCreateInput {
  name: string
  description?: string
  price: number
  categoryId: string
}

export interface ProductUpdateInput extends ProductCreateInput {
  id: string
}