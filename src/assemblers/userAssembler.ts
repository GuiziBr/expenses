import { IUser } from '../domains/user'

export function assembleUser({ id, name, email, avatar, created_at, updated_at }: IUser): object {
  return { id, name, email, avatar, created_at, updated_at }
}
