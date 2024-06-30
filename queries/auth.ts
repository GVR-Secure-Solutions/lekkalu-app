import { AxiosHeaders } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/utils/token'
import { socialLoginClient, tokenClient, userClient } from '@/utils/client'
import { User } from '@/types/user'
import { LoginResponseType, LoginSchema, LoginWithGoogleSchema, SignupSchema } from '@/schema/auth'
import { AUTH } from '@/utils/query-keys'

export async function refreshToken() {
  const _refreshToken = await getToken('refresh')
  const { data } = await tokenClient.post<LoginResponseType>('/refresh/', {
    refresh: _refreshToken,
  })
  return data
}

export async function fetchUser() {
  const token = await getToken('access')
  if (!token) {
    return null
  }
  const headers = new AxiosHeaders()
  headers.setAuthorization(`Bearer ${token}`)
  const { data } = await userClient.get<User>('/users/detail', { headers })
  return data
}

export async function login(dto: Omit<LoginSchema, 'rememberMe'>) {
  const { data } = await tokenClient.post<LoginResponseType>('/', dto)
  return data
}

export async function loginWithGoogle(dto: LoginWithGoogleSchema) {
  const { data } = await socialLoginClient.post<LoginResponseType>('dj-rest-auth/google/login/', dto)
  return data
}

export async function signup(dto: Omit<SignupSchema, 'termsAndConditions' | 'privacyPolicy'>) {
  const { data } = await userClient.post<{ email: string; username: string }>('/users_1', dto)
  return data
}

export const deleteAccount = async () => {
  const headers = new AxiosHeaders()
  const accessToken = await getToken('access')

  if (accessToken) {
    headers.setAuthorization(`Bearer ${accessToken}`)
  }

  const { data } = await userClient.delete('/delete_user_account', { headers })
  return data
}

export const useGetUserDetails = () => {
  return useQuery({ queryFn: fetchUser, queryKey: [AUTH.USER_DATA] })
}

export async function loginImaginaryUser(dto: Omit<LoginSchema, 'rememberMe'> & { id: number }) {
  const { data } = await tokenClient.post<{ access: string; refresh: string }>('/', dto)
  return { ...data, username: dto.username, id: dto.id }
}
