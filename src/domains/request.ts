export interface ICreateExpenseRequest {
  owner_id: string,
  description: string,
  date: Date,
  amount: number,
  category_id: string
  personal: boolean
  split: boolean
  payment_type_id: string
  store_id?: string
  bank_id?: string
}
export interface ICreateUserRequest {
  name: string,
  email: string,
  password: string
}

export interface IUpdateAvatarRequest {
  user_id: string
  avatarFileName: string
}
