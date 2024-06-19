/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { IncomeStatement } from '@/types/income'
import { IAddEditIncomeExpenseSchema } from '@/schema/income-statement'
import { AddLiabilitySchema, AddPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'
import { Liability, PhysicalAsset } from '@/types/balance-sheet'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { SCENARIO } from '@/utils/query-keys/scenarios'

const useScenario = () => {
  const { getAPIClientForImaginaryUser } = useImaginaryAuth()
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<any>([AUTH.IMAGINARY_CLIENT])
  const apiClient = getAPIClientForImaginaryUser(IMAGINARY_USER?.access || '')

  async function createIncomeExpense(dto: IAddEditIncomeExpenseSchema) {
    const { data } = await apiClient.post('income_expense/', dto)
    return data
  }

  const addIncomeMutation = useMutation({ mutationFn: createIncomeExpense })

  async function updateIncomeExpense(id: number, dto: Partial<IAddEditIncomeExpenseSchema>) {
    const { data } = await apiClient.put(`income_expense/${id}`, dto)
    return data
  }

  async function fetchIncomeExpenses() {
    const { data } = await apiClient.get<Array<IncomeStatement & { isNew: boolean }>>('income_expense/')
    return data
  }

  async function fetchIncomeExpensesById(id: number) {
    const { data } = await apiClient.get(`income_expense/${id}`)
    return data
  }

  const getAllIncomeExpensesQuery = useQuery({
    queryKey: [`${INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE}-${IMAGINARY_USER?.username}`],
    queryFn: fetchIncomeExpenses,
  })

  async function deleteIncomeExpense(id: number) {
    const { data } = await apiClient.delete(`income_expense/${id}`)
    return data
  }

  const deleteIncomeExpenseMutation = useMutation({ mutationFn: deleteIncomeExpense })

  async function fetchLiabilities() {
    const { data } = await apiClient.get<Liability[]>('loans/')
    return data
  }

  async function fetchLiabilityById(id: number) {
    const { data } = await apiClient.get<Liability>(`loans/${id}`)
    return data
  }

  const fetchScenarioEntities = async () => {
    const liabilities = await apiClient.get<Liability[]>('loans/')
    const income = await apiClient.get<Array<IncomeStatement>>('income_expense/')
    const asset = await apiClient.get<PhysicalAsset[]>('physical_assets/')

    return { liabilities: liabilities.data, income: income.data, asset: asset.data }
  }

  const getAllScenarioEntitiesQuery = useQuery({
    queryKey: [`${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`],
    queryFn: fetchScenarioEntities,
    select: (data) => {
      const income = data?.income?.map((each) => ({
        id: each?.id,
        entity_type: 'Expense',
        name: each?.name,
        amount: each?.amount,
      }))
      const liabilities = data?.liabilities?.map((each) => ({
        entity_type: 'Liabilities',
        name: each?.name,
        amount: each?.balance,
        id: each?.id,
      }))
      const asset = data?.asset?.map((each) => ({
        entity_type: 'Asset',
        name: each?.name,
        amount: each?.purchase_value,
        id: each?.id,
      }))

      return [...income, ...liabilities, ...asset]
    },
    staleTime: 0,
  })

  const getAllLiabilities = useQuery({
    queryKey: [`${BALANCE_SHEET.LIABILITIES}-${IMAGINARY_USER?.username}`],
    queryFn: fetchLiabilities,
  })

  async function addLiability(dto: AddLiabilitySchema) {
    const { data } = await apiClient.post('loans/', dto)
    return data
  }

  const addLiabilityMutation = useMutation({
    mutationFn: addLiability,
  })

  async function updateLiability(id: number, dto: Partial<AddLiabilitySchema>) {
    const { data } = await apiClient.put(`loans/${id}`, dto)
    return data
  }

  async function deleteLiability(id: number) {
    const { data } = await apiClient.delete(`loans/${id}`)
    return data
  }

  const deleteLiabilityMutation = useMutation({ mutationFn: deleteLiability })

  async function fetchPhysicalAssets() {
    const { data } = await apiClient.get<PhysicalAsset[]>('physical_assets/')
    return data
  }

  async function deletePhysicalAsset(id: number) {
    const { data } = await apiClient.delete<{ message: string }>(`/physical_assets/${id}`)
    return data
  }

  const deletePhysicalAssetMutation = useMutation({ mutationFn: deletePhysicalAsset })

  async function addPhysicalAsset(dto: AddPhysicalAssetSchemaForScenario) {
    const { data } = await apiClient.post<PhysicalAsset[]>('/physical_assets/', dto)
    return data
  }

  const addPhysicalAssetMutation = useMutation({
    mutationFn: addPhysicalAsset,
  })

  async function editPhysicalAsset(id: number, dto: Partial<AddPhysicalAssetSchemaForScenario>) {
    const { data } = await apiClient.put(`physical_assets/${id}`, dto)
    return data
  }

  return {
    addIncomeMutation,
    updateIncomeExpense,
    getAllIncomeExpensesQuery,
    deleteIncomeExpense,
    getAllLiabilities,
    getAllScenarioEntitiesQuery,
    IMAGINARY_USER,
    addPhysicalAssetMutation,
    addLiabilityMutation,
    deleteLiabilityMutation,
    deleteIncomeExpenseMutation,
    deletePhysicalAssetMutation,
    fetchIncomeExpensesById,
    fetchLiabilityById,
    updateLiability,
  }
}

export default useScenario
