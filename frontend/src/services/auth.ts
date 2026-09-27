const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8000'
const BASE_URL = import.meta.env.VITE_API_URL || `http://localhost:${BACKEND_PORT}/api`

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface UserResponse {
  id: number
  username: string
  email: string
  is_active?: boolean
  is_admin?: boolean
  created_at?: string
  updated_at?: string
}

export const authApi = {
  async register(data: RegisterPayload): Promise<UserResponse> {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.detail || 'Registration failed')
    }

    return res.json()
  },

  async login(data: LoginPayload): Promise<any> {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.detail || 'Invalid username or password')
    }

    return res.json()
  },

  async getUsers(): Promise<UserResponse[]> {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.detail || 'Failed to fetch users')
    }

    return res.json()
  },
}
