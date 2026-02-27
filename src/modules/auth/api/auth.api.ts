import { axiosClient } from '@/infrastructure/http/axiosClient'
import type { LoginRequest } from '../schemas/login.schema'

export const loginApi = async (payload: LoginRequest): Promise<string> => {
  const { data } = await axiosClient.post<{ token: string }>('/login', payload)

  if (!data?.token) {
    throw new Error('El backend no retornó token JWT')
  }

  return data.token
}