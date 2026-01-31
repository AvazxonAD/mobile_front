export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  level?: number
  totalPoints?: number
  streak?: number
}

export type UserUpdateData = Partial<User>