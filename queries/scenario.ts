import { apiClient as v1ApiClient } from '@/utils/client'
import { Comparison, Scenario } from '@/types/scenarios'
import { AddScenarioSchemas } from '@/schema/scenarios'

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
  const { data } = await v1ApiClient.delete<Scenario>(`/scenario/${id}`)
  return data
}

// All comparison related APIs

export async function fetchComparisons() {
  const { data } = await v1ApiClient.get<Comparison[]>('/comparison/')
  return data
}
