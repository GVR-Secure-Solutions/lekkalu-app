import React, { useEffect, useMemo } from 'react'
import { Button, Text, View } from 'tamagui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useToast } from 'native-base'

import { hp, wp } from '@/utils/responsive'
import { IAddEditIncomeExpenseSchema, addEditIncomeExpenseSchema } from '@/schema/income-statement'
import { FontSizes } from '@/utils/fonts'
import BackButton from '../../components/back-button'
import KeyboardScrollView from '../../components/keyboard-scroll-view'
import InputFields from '../../components/input-fields'
import { getAddIncomeExpenseInputs } from '@/utils/income-statement'
import LoaderOverlay from '../../components/loader-overlay'
import {
  APIAddIncomeStatementPayload,
  APIIncomeSourceItemType,
  useAddIncomeExpense,
  useAddIncomeSource,
  useGetIncomeExpenseTypes,
  useGetIncomeSourceTypes,
  useUpdateIncomeExpense,
  useUpdateIncomeSource,
} from '@/queries/income-statement'
import { queryClient } from '@/utils/query-client'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'

interface ScreenParams {
  type: 'income' | 'expense'
  editItem?: APIIncomeSourceItemType | null
}

const dummyIncomeTypes = [
  { id: 1, label: 'Salary' },
  { id: 2, label: 'Interest' },
]
const dummyExpenseTypes = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Investment' },
  { id: 3, label: 'Loan_repayment' },
]

const AddEditIncomeExpense = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const params = useLocalSearchParams<ScreenParams>()
  const toast = useToast()

  const isIncome = useMemo(() => params?.type === 'income', [params])
  const editItem = params?.editItem
  const pageTitle = isIncome ? `${editItem ? 'Edit' : 'Add'} Income` : `${editItem ? 'Edit' : 'Add'} Expense`

  const { data: incomeSourceTypesQueryData } = useGetIncomeSourceTypes({ enabled: isIncome })
  const { data: incomeExpenseTypesQueryData } = useGetIncomeExpenseTypes({ enabled: !isIncome })
  const { mutateAsync: addIncomeSourceMutation, isPending: isPendingAddIncomeSource } = useAddIncomeSource()
  const { mutateAsync: addIncomeExpenseMutation, isPending: isPendingAddIncomeExpense } = useAddIncomeExpense()
  const { mutateAsync: updateIncomeExpenseMutation, isPending: isPendingUpdateIncomeExpense } = useUpdateIncomeExpense()
  const { mutateAsync: updateIncomeSourceMutation, isPending: isPendingUpdateIncomeSource } = useUpdateIncomeSource()

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IAddEditIncomeExpenseSchema>({
    resolver: zodResolver(addEditIncomeExpenseSchema),
    defaultValues: editItem
      ? {
          amount: editItem.amount,
          name: editItem.name,
          type: editItem.type,
        }
      : undefined,
  })

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      reset()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, reset])

  const handleEditIncomeExpense = async (values: IAddEditIncomeExpenseSchema) => {
    try {
      if (editItem) {
        const payload: APIAddIncomeStatementPayload = {
          ...values,
          amount: values.amount.toString(),
        }
        if (isIncome) {
          await updateIncomeSourceMutation({ payload, id: editItem.id })
          queryClient.invalidateQueries({ queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE] })
        } else {
          await updateIncomeExpenseMutation({ payload, id: editItem.id })
          queryClient.invalidateQueries({ queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE] })
        }
        router.push('/(authenticated)/income-statement')
        toast.show({ title: (isIncome ? 'Income' : 'Expense') + ' updated successfully' })
      }
    } catch (error) {
      toast.show({ title: 'Failed to edit ' + (isIncome ? 'income' : 'expense') })
    }
  }

  const handleAddIncomeExpense = async (values: IAddEditIncomeExpenseSchema) => {
    try {
      const payload: APIAddIncomeStatementPayload = {
        ...values,
        amount: values.amount.toString(),
      }
      if (isIncome) {
        await addIncomeSourceMutation(payload)
        queryClient.invalidateQueries({ queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE] })
      } else {
        await addIncomeExpenseMutation(payload)
        queryClient.invalidateQueries({ queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE] })
      }
      queryClient.invalidateQueries({ queryKey: [INCOME_STATEMENT_QUERY_KEYS.INCOME_SOURCE] })
      router.push('/(authenticated)/income-statement')
      toast.show({ title: (isIncome ? 'Income' : 'Expense') + ' added successfully' })
    } catch (error) {
      toast.show({ title: 'Failed to add ' + (isIncome ? 'income' : 'expense') })
    }
  }

  const inputs = useMemo(() => getAddIncomeExpenseInputs(isIncome ? dummyIncomeTypes : dummyExpenseTypes), [isIncome])

  const isLoading =
    isPendingAddIncomeSource || isPendingAddIncomeExpense || isPendingUpdateIncomeExpense || isPendingUpdateIncomeSource

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      {isLoading && <LoaderOverlay />}
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/income-statement')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {pageTitle}
        </Text>
      </View>
      <KeyboardScrollView style={{ paddingHorizontal: wp(5), marginTop: hp(3) }}>
        <View rowGap={hp(1)}>
          <InputFields control={control} errors={errors} inputs={inputs} />
        </View>
        <Button
          fontSize={FontSizes.size18}
          h={hp(5.5)}
          onPress={handleSubmit(editItem ? handleEditIncomeExpense : handleAddIncomeExpense)}
          bg="$primary"
          color="white"
          mt={hp(4)}
        >
          {pageTitle}
        </Button>
      </KeyboardScrollView>
    </View>
  )
}

export default AddEditIncomeExpense
