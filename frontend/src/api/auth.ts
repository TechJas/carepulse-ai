import { api, setToken, clearToken, getToken } from './client'
export { clearToken, getToken }

export interface UserInfo {
  id: number
  name: string
  role: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}

export interface MeResponse {
  id: number
  name: string
  email: string
  role: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(res.token)
  return res
}

export async function getMe(): Promise<MeResponse> {
  return api<MeResponse>('/api/auth/me')
}
