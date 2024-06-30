import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useToast } from 'native-base'
import { AxiosInstance } from 'axios'

import { GOAL_QUERY_KEYS } from '@/utils/query-keys/goal'
import { apiClient, apiv2Client } from '@/utils/client'
import { queryClient } from '@/utils/query-client'

interface AddGoalPayloadType {
  name: string
  target_value: number
  target_contribution_source: number
  track_kpi: string
  goal_proportionality: string
  target_date: string
}

interface GoalItemType {
  created_at: string
  current_value: number
  goal_proportionality: string
  id: number
  name: string
  reachable_by_days: number
  target_contribution_source: number
  target_date: string | null
  target_value: number
  track_kpi: string
  updated_at: string
  user: number
  met: boolean
}

interface DropdownItemType {
  id: number
  label: string
}

interface GoalSourceItemType {
  id: number
  name: string
  type: string
  amount: string
}

interface GoalProgressType {
  name: string
  progress_percent: number
}

interface GoalTimelineItem {
  time: string
  kpi_value: number
}

interface EditGoalPayloadType {
  id: number
  payload: AddGoalPayloadType
}

const getGoalKpiData = () => {
  return apiv2Client.get<DropdownItemType[]>('/financial_goal/kpis_type')
}

const useGetGoalKpiData = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_KPI],
    queryFn: getGoalKpiData,
  })
}

const getGoalProportionalityData = () => {
  return apiv2Client.get<DropdownItemType[]>('/financial_goal/goal_proportionality_type')
}

const useGetProportionality = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_PROPORTIONALITY],
    queryFn: getGoalProportionalityData,
  })
}

const addGoalMutationFn = async (data: AddGoalPayloadType) => {
  return apiv2Client.post('/financial_goal/', data)
}

const useAddGoalMutation = () => {
  const toast = useToast()
  return useMutation({
    mutationFn: addGoalMutationFn,
    onSuccess: () => {
      router.push('/(authenticated)/goals')
    },
    onError: () => {
      toast.show({ title: 'Failed to create Goal! Please try again' })
    },
  })
}

const getGoalSources = () => {
  return apiClient.get<GoalSourceItemType[]>('/income_expense/')
}

const useGetGoalSources = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_SOURCE],
    queryFn: getGoalSources,
  })
}

const getGoals = () => {
  return apiv2Client.get<GoalItemType[]>('/financial_goal/')
}

const useGetGoals = () => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOALS],
    queryFn: getGoals,
  })
}

const getGoalProgress = (id: number) => {
  return apiv2Client.get<GoalProgressType>(`/financial_goal/progress/${id}`)
}

const useGetGoalProgress = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOALS_PROGRESS, id],
    queryFn: () => getGoalProgress(id),
  })
}

const getGoalDetails = (id: number) => {
  return apiv2Client.get<GoalItemType>(`/financial_goal/${id}`)
}

const useGetGoalDetails = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_DETAILS, id],
    queryFn: () => getGoalDetails(id),
  })
}

const getGoalTimeline = (id: number) => {
  return apiv2Client.get<GoalTimelineItem[]>(`/financial_goal/timeline/${id}/`)
}

const useGetGoalTimeline = (id: number) => {
  return useQuery({
    queryKey: [GOAL_QUERY_KEYS.GOAL_TIMELINE, id],
    queryFn: () => getGoalTimeline(id),
  })
}

const editGoal = (data: EditGoalPayloadType) => {
  return apiv2Client.put(`/financial_goal/${data.id}`, data.payload)
}

const useEditGoal = () => {
  const toast = useToast()

  return useMutation({
    mutationFn: editGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GOAL_QUERY_KEYS.GOALS],
      })
      toast.show({ title: 'Goal updated successfully' })
      router.push('/(authenticated)/goals')
    },
    onError: (e: any) => {
      toast.show({ title: e.response?.data?.message || 'Failed to update goal' })
    },
  })
}

const deleteGoal = (id: number) => {
  return apiv2Client.delete(`/financial_goal/${id}`)
}

const useDeleteGoal = () => {
  const toast = useToast()
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      toast.show({ title: 'Goal deleted successfully' })
      queryClient.invalidateQueries({
        queryKey: [GOAL_QUERY_KEYS.GOALS],
      })
    },
    onError: () => {
      toast.show({ title: 'Failed to delete goal' })
    },
  })
}

async function addGoalForImaginaryUser(dto: any, apiClient: AxiosInstance) {
  const { data } = await apiClient.post('financial_goal/', dto)
  return data
}

export {
  useGetGoalKpiData,
  useGetProportionality,
  useAddGoalMutation,
  useGetGoalSources,
  useGetGoals,
  useGetGoalProgress,
  useGetGoalDetails,
  useGetGoalTimeline,
  useEditGoal,
  useDeleteGoal,
  AddGoalPayloadType,
  GoalItemType,
  DropdownItemType,
  GoalSourceItemType,
  GoalProgressType,
  GoalTimelineItem,
  EditGoalPayloadType,
  addGoalForImaginaryUser,
}
