import { apiClient as v1ApiClient } from '@/utils/client'
import { Comparison, Scenario } from '@/types/scenarios'
import { AddScenarioSchemas } from '@/schema/scenarios'
import { AddComparisonSchema } from '@/schema/comparisons'

export async function fetchScenarios() {
  const { data } = await v1ApiClient.get<Scenario[]>('/scenario/')
  return data
}

export async function createScenarios(dto: AddScenarioSchemas) {
  const { data } = await v1ApiClient.post<Scenario>('/scenario/', dto)
  return data
}

export async function fetchScenarioById(id: number) {
  const { data } = await v1ApiClient.get<Scenario>(`/scenario/${id}`)
  return data
}

export async function editScenario(id: number, dto: Partial<AddScenarioSchemas>) {
  const { data } = await v1ApiClient.put<Scenario>(`/scenario/${id}`, dto)
  return data
}

export async function deleteScenario(id: number) {
  try {
    const { data } = await v1ApiClient.delete<Scenario>(`/scenario/${id}`)
    return data
  } catch (e) {
    console.log('error', e)
  }
}

// All comparison related APIs

export async function fetchComparisons() {
  const { data } = await v1ApiClient.get<Comparison[]>('/comparison/')
  return data
}

export async function createComparison(dto: AddComparisonSchema) {
  const { data } = await v1ApiClient.post<Comparison>('/comparison/', dto)
  return data
}

export async function fetchComparisonById(id: number) {
  const { data } = await v1ApiClient.get<Comparison>(`/comparison/${id}`)
  return data
}

export async function updateComparison(id: number, dto: Partial<AddComparisonSchema>) {
  const { data } = await v1ApiClient.put<Comparison>(`/comparison/${id}`, dto)
  return data
}

export async function deleteComparison(id: number) {
  try {
    const { data } = await v1ApiClient.delete<Comparison>(`/comparison/${id}`)
    return data
  } catch (e) {
    console.log('error', e)
  }
}
