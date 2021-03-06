interface User {
  id: string
  name: string,
  email: string,
  created_at: Date,
  updated_at: Date,
  avatar: string
}

export function assembleSession({ id, name, email, avatar, created_at, updated_at }: User, token: string): object {
  return { user: { id, name, email, avatar, created_at, updated_at }, token }
}
