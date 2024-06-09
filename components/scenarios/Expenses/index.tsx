import React, { useEffect, useMemo } from 'react'
import { X } from '@tamagui/lucide-icons'
import { Dialog, View, Button } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { getAddIncomeExpenseInputs } from '@/utils/income-statement'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import useScenario from '@/hooks/use-scenario'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'

const EXPENSES_TYPE = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Investment' },
  { id: 3, label: 'Loan_repayment' },
]

const ExpensesForScenario = ({ handleComplete }: any) => {
  const qc = useQueryClient()

  const form = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
  })

  const inputs = useMemo(() => getAddIncomeExpenseInputs(EXPENSES_TYPE), [])

  const { addIncomeMutation } = useScenario()

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
        queryKey: [`${INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE}-imaginary-user`],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addIncomeMutation?.isSuccess])

  return (
    <View>
      <Dialog open={true}>
        <Dialog.Portal key={'Expense-dialog-portal'}>
          <Dialog.Overlay key={'overlay'} />
          <Dialog.Content style={{ width: '100%', height: '90%' }} key={'Expense-dialog-content'}>
            <Dialog.Title>
              <Dialog.Close asChild>
                <View flexDirection="row" justifyContent="flex-end">
                  <Button size="$2" circular icon={X} onPress={() => handleComplete()} />
                </View>
              </Dialog.Close>
            </Dialog.Title>
            <View h={'100%'}>
              <AddEditEntityForScenario
                entityName="Expenses"
                form={form}
                inputs={inputs}
                mutation={handleAdd}
                isLoading={addIncomeMutation.isPending}
              />
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  )
}

export default ExpensesForScenario
