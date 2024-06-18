import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from 'native-base'
import { useCallback, useEffect, useState } from 'react'
import { router } from 'expo-router'
import constate from 'constate'
import { deleteAccount, fetchUser, login, loginWithGoogle as googleLogin, refreshToken, signup } from '@/queries/auth'
import { AUTH } from '@/utils/query-keys'
import { setToken } from '@/utils/token'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants'
import { LoginResponseType } from '@/schema/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const qc = useQueryClient()
  const toast = useToast()

  const { mutate: fetchUserData, data: userData } = useMutation({
    mutationKey: [AUTH.USER_DATA],
    mutationFn: fetchUser,
  })

  const {
    isFetching: isAuthenticationInProgress,
    data: tokenData,
    status: refreshTokenStatus,
  } = useQuery({
    queryKey: [AUTH.LOGGED_IN],
    queryFn: refreshToken,
  })

  useEffect(
    function updateTokenData() {
      if (refreshTokenStatus === 'success') {
        setIsAuthenticated(true)
        setToken('refresh', tokenData.refresh)
        setToken('access', tokenData.access)
        fetchUserData()
      }
    },
    [refreshTokenStatus, fetchUserData, tokenData?.refresh, tokenData?.access],
  )

  const handleLoginSuccess = (data: LoginResponseType) => {
    toast.show({ title: 'Successfully logged in!' })

    /** Saving the tokens */
    setToken('refresh', data.refresh)
    setToken('access', data.access)

    /** updating the data in queryClient */
    qc.setQueryData([AUTH.LOGGED_IN], data)

    fetchUserData()
  }

  const handleLoginError = () => {
    toast.show({
      title: 'Invalid Credentials!',
      description: 'You have entered the wrong credentials!',
    })
  }

  const loginMutation = useMutation({
    mutationKey: [AUTH.LOGIN],
    mutationFn: login,
    onSuccess: (data) => handleLoginSuccess(data),
    onError: handleLoginError,
  })

  const loginWithGoogleMutation = useMutation({
    mutationKey: [AUTH.LOGIN_WITH_GOOGLE],
    mutationFn: googleLogin,
    onSuccess: (data) => handleLoginSuccess(data),
    onError: handleLoginError,
  })

  const signupMutation = useMutation({
    mutationKey: [AUTH.SIGNUP],
    mutationFn: signup,
    onSuccess: () => {
      toast.show({
        title: 'Signup Success!',
        description: 'Your account has been created successfully now you can login to you account!',
      })

      router.replace('/login')
    },
    onError: () => {
      toast.show({
        title: 'Error!',
        description: 'Failed to create your account! Please try again after sometime',
      })
    },
  })

  const logout = useCallback(async () => {
    setIsAuthenticated(false)
    await AsyncStorage.multiRemove([REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY])
    qc.clear() // Empties query cache
    router.replace('/login')
  }, [qc])

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.show({
        title: 'Delete Success!',
        description: 'Your account has been successfully deleted!',
      })
      logout()
    },
    onError: () => {
      toast.show({
        title: 'Error!',
        description: 'Failed to delete your account!',
      })
    },
  })

  return {
    isAuthenticated,
    isAuthenticationInProgress,
    tokenData,
    loginMutation,
    logout,
    signupMutation,
    userData,
    deleteAccountMutation,
    loginWithGoogleMutation,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
