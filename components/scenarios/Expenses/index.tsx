import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { getAddIncomeExpenseInputs } from '@/utils/income-statement'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import useScenario from '@/hooks/use-scenario'
import { AUTH } from '@/utils/query-keys'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'
import { SCENARIO } from '@/utils/query-keys/scenarios'

const EXPENSES_TYPE = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Investment' },
  { id: 3, label: 'Loan_repayment' },
]

const ExpensesForScenario = ({ handleComplete }: any) => {
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])

  const form = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
  })

  const { addIncomeMutation, getAllScenarioEntitiesQuery } = useScenario()

  const inputs = useMemo(() => getAddIncomeExpenseInputs(EXPENSES_TYPE), [])

  const handleAdd = () => {
    try {
      addIncomeMutation.mutate(form.getValues())
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (addIncomeMutation.isSuccess) {
      handleComplete()
      qc.invalidateQueries({
        queryKey: [`${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`],
      })
      getAllScenarioEntitiesQuery.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addIncomeMutation?.isSuccess])

  return (
    <AddEditEntityForScenario
      entityName="Expenses"
      form={form}
      inputs={inputs}
      mutation={handleAdd}
      isLoading={addIncomeMutation.isPending}
      handleComplete={handleComplete}
    />
  )
}

export default ExpensesForScenario
