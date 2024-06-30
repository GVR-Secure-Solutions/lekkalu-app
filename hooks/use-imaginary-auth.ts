import constate from 'constate'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { loginImaginaryUser } from '@/queries/auth'
import { AUTH } from '@/utils/query-keys'

export type ImaginaryUser = {
  [key: string]: { refresh: string; access: string; id: number }
}

export function useImaginaryAuth() {
  const qc = useQueryClient()
  const [imaginaryUsers, setImaginaryUsers] = useState<ImaginaryUser>({})
  // const { data: imag_users } = useQuery<ImaginaryUser>({ queryKey: [AUTH.IMAGINARY_CLIENT] })

  const loginImaginaryUserMutation = useMutation({
    mutationFn: loginImaginaryUser,
    onSuccess: (data) => {
      qc.setQueryData([AUTH.IMAGINARY_CLIENT], {
        access: data?.access,
        refresh: data?.refresh,
        id: data?.id,
        username: data?.username,
      })
      qc.setQueryData([AUTH.CURRENT_IMAGINARY_USER], data.username)
    },
  })

  const getAPIClientForImaginaryUser = (token: string, version?: string) => {
    let baseURL = process.env.EXPO_PUBLIC_API_BASE_URL
    if (version === 'v2') {
      baseURL = process.env.EXPO_PUBLIC_API_V2_BASE_URL
    }
    const apiClient = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return apiClient
  }

  return {
    imaginaryUsers,
    setImaginaryUsers,
    loginImaginaryUser: loginImaginaryUserMutation,
    getAPIClientForImaginaryUser,
  }
}

export const [ImaginaryAuthProvider, useImaginaryContext] = constate(useImaginaryAuth)
