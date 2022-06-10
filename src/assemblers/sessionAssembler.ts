import { IUser } from '../domains/user'

export function assembleSession({ id, name, email, avatar, created_at, updated_at }: IUser, token: string): object {
  return { user: { id, name, email, avatar, created_at, updated_at }, token }
}
