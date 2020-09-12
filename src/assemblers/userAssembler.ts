interface User {
  id: string
  name: string,
  email: string,
  created_at: Date,
  updated_at: Date,
  avatar: string
}

export default function user ({ id, name, email, avatar, created_at, updated_at }: User): object {
  return {
    id,
    name,
    email,
    avatar,
    created_at,
    updated_at
  }
}
