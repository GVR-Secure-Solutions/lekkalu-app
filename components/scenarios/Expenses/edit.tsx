import React, { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { AUTH } from '@/utils/query-keys'
import { getAddIncomeExpenseInputs } from '@/utils/income-statement'
import { EXPENSES_TYPE } from './add'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import useScenario from '@/hooks/use-scenario'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { SCENARIO } from '@/utils/query-keys/scenarios'

type EditExpenseForScenarioType = {
  id: number
  handleComplete: () => void
}

const EditExpenseForScenario = ({ id, handleComplete }: EditExpenseForScenarioType) => {
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])
  const inputs = useMemo(() => getAddIncomeExpenseInputs(EXPENSES_TYPE), [])

  const { fetchIncomeExpensesById, updateIncomeExpense, getAllScenarioEntitiesQuery } = useScenario()

  const fetchIncomeExpenseByIdQuery = useQuery({
    queryKey: [`${INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE}-${id}-${IMAGINARY_USER?.username}`],
    queryFn: () => fetchIncomeExpensesById(id),
    staleTime: 0,
  })

  const form = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
    values: {
      ...fetchIncomeExpenseByIdQuery.data,
    },
  })

  const updateIncomeExpenseMutation = useMutation({
    mutationFn: (dto: Partial<IAddEditIncomeExpenseSchema>) => updateIncomeExpense(id, dto),
  })

  const handleEdit = () => {
    updateIncomeExpenseMutation.mutate(form.watch())
  }

  useEffect(() => {
    if (updateIncomeExpenseMutation.isSuccess) {
      qc.invalidateQueries({
        queryKey: [
          `${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`,
          `${INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE}-${id}-${IMAGINARY_USER?.username}`,
        ],
      })
      getAllScenarioEntitiesQuery.refetch()
      handleComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateIncomeExpenseMutation.isSuccess])

  if (fetchIncomeExpenseByIdQuery.isLoading) {
    return <></>
  }

  return (
    <AddEditEntityForScenario
      isEdit
      entityName="Expense"
      form={form}
      inputs={inputs}
      mutation={handleEdit}
      isLoading={updateIncomeExpenseMutation.isPending}
      handleComplete={handleComplete}
    />
  )
}

export default EditExpenseForScenario
