import { UndefinedInitialDataOptions, useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { apiClient } from '@/utils/client'
import { Option } from '@/types/input-fields'

interface APIIncomeSourceItemType {
  id: number
  name: string
  type: string
  amount: string
}

interface APIIncomeExpenseItemType {
  id: number
  name: string
  type: string
  amount: string
}

interface APIAddIncomeStatementPayload {
  name: string
  type: string
  amount: string
}

export const getIncomeSouce = () => {
  return apiClient.get<APIIncomeSourceItemType[]>('/income_source/')
}

const useGetIncomeSource = () => {
  return useQuery({
    queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE],
    queryFn: getIncomeSouce,
  })
}

const getIncomeExpense = () => {
  return apiClient.get<APIIncomeExpenseItemType[]>('/income_expense/')
}

const useGetIncomeExpense = () => {
  return useQuery({
    queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE],
    queryFn: getIncomeExpense,
  })
}

const deleteIncomeSource = (id: number) => {
  return apiClient.delete(`/income_source/${id}`)
}

const useDeleteIncomeSource = () => {
  return useMutation({ mutationFn: deleteIncomeSource })
}

const deleteIncomeExpense = (id: number) => {
  return apiClient.delete(`/income_expense/${id}`)
}

const useDeleteIncomeExpense = () => {
  return useMutation({ mutationFn: deleteIncomeExpense })
}

const getIncomeSourceTypes = () => {
  return apiClient.get<Option[]>('/income_source_type')
}

const useGetIncomeSourceTypes = (options: Pick<UndefinedInitialDataOptions, 'enabled'> = {}) => {
  return useQuery<AxiosResponse<Option[]>>({
    queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE_TYPES],
    queryFn: getIncomeSourceTypes,
    ...options,
  })
}

const getIncomeExpenseTypes = () => {
  return apiClient.get<Option[]>('/income_expense_type')
}

const useGetIncomeExpenseTypes = (options: Pick<UndefinedInitialDataOptions, 'enabled'> = {}) => {
  return useQuery<AxiosResponse<Option[]>>({
    queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE_TYPES],
    queryFn: getIncomeExpenseTypes,
    ...options,
  })
}

const addIncomeSource = (payload: APIAddIncomeStatementPayload) => {
  return apiClient.post('/income_source/', payload)
}

const useAddIncomeSource = () => {
  return useMutation({ mutationFn: addIncomeSource })
}

const addIncomeExpense = (payload: APIAddIncomeStatementPayload) => {
  return apiClient.post('/income_expense/', payload)
}

const useAddIncomeExpense = () => {
  return useMutation({ mutationFn: addIncomeExpense })
}

const updateIncomeSource = ({ id, payload }: { id: number; payload: APIAddIncomeStatementPayload }) => {
  return apiClient.put(`/income_source/${id}`, payload)
}

const useUpdateIncomeSource = () => {
  return useMutation({ mutationFn: updateIncomeSource })
}

const updateIncomeExpense = ({ id, payload }: { id: number; payload: APIAddIncomeStatementPayload }) => {
  return apiClient.put(`/income_expense/${id}`, payload)
}

const useUpdateIncomeExpense = () => {
  return useMutation({ mutationFn: updateIncomeExpense })
}

export {
  useGetIncomeSource,
  useGetIncomeExpense,
  useDeleteIncomeSource,
  useDeleteIncomeExpense,
  useGetIncomeSourceTypes,
  useGetIncomeExpenseTypes,
  useAddIncomeSource,
  useAddIncomeExpense,
  useUpdateIncomeSource,
  useUpdateIncomeExpense,
  APIIncomeSourceItemType,
  APIIncomeExpenseItemType,
  APIAddIncomeStatementPayload,
}
