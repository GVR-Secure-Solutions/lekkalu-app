import axios from 'axios'
import { useToast } from 'native-base'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'

import { FeedbackSchema } from '@/schema/settings'
import { BASE_URL, apiClient, userClient } from '@/utils/client'
import { getAxiosHeaderWithToken } from '@/utils/helpers'

interface SubmitFeedbackResponseType {
  id: number
  name: string
  email: string
  subject_and_description: string
}

interface ResetPasswordPayloadType {
  email: string
}

interface EditProfilePayloadType {
  username: string
  first_name: string
  last_name: string
}

interface EmailVerifyPayloadType {
  email: string
}

const submitFeedback = async (dto: FeedbackSchema) => {
  const { data } = await apiClient.post<SubmitFeedbackResponseType>('feedback/', dto)
  return data
}

const useSubmitFeedback = (resetForm: Function) => {
  const toast = useToast()

  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      resetForm()
      toast.show({ title: 'Feedback Submitted Successfully' })
      router.push('/(authenticated)/settings')
    },
    onError: () => {
      toast.show({ title: 'Could not send feedback, please try again later!' })
    },
  })
}

const resetPassword = (payload: ResetPasswordPayloadType) => {
  const headers = getAxiosHeaderWithToken()
  return userClient.post(BASE_URL + '/users/dj-rest-auth/password/reset/', payload, { headers })
}

const useResetPassword = (resetForm: Function) => {
  const toast = useToast()
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      resetForm()
    },
    onError: () => {
      toast.show({
        title: 'Could not send reset password link, please try again later!',
      })
    },
  })
}

const editProfile = (payload: EditProfilePayloadType) => {
  return userClient.put('/users/detail', payload)
}

const useEditProfile = () => {
  const toast = useToast()
  return useMutation({
    mutationFn: editProfile,
    onError: () => {
      toast.show({ title: 'Failed to Update Profile' })
    },
    onSuccess: () => {
      toast.show({ title: 'Profile Updated Successfully' })
      router.push('/(authenticated)/settings')
    },
  })
}

const verifyEmail = (payload: EmailVerifyPayloadType) => {
  const headers = getAxiosHeaderWithToken()
  return axios.post(BASE_URL + '/users/dj-rest-auth/registration/resend-email/', payload, { headers })
}

const useVerifyEmail = (resetForm: Function) => {
  const toast = useToast()
  return useMutation({
    mutationFn: verifyEmail,
    onError: () => {
      toast.show({ title: 'Could not send email verification link, please try again later!' })
    },
    onSuccess: () => {
      resetForm()
      router.push('/(authenticated)/settings')
    },
  })
}

export { useSubmitFeedback, useResetPassword, useEditProfile, useVerifyEmail }
