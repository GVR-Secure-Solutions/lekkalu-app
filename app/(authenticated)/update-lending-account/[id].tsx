import { useEffect, useMemo } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, VStack, useToast } from 'native-base'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { View, useTheme } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { hp } from '@/utils/responsive'
import { fetchLendingAccountById, updateLendingAccount } from '@/queries/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { Success } from '@/utils/toast'
import { addAccountSchema } from '@/schema/lending'
import { AddAccountSchema } from '@/types/lending'
import { calculateTransactionAmount } from '@/utils/lending'
import { InputField } from '@/types/input-fields'
import InputFields from '@/components/input-fields/input-fields'

export default function UpdateLendingAccount() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const toast = useToast()
  const qc = useQueryClient()
  const theme = useTheme()
  const {
    reset,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<AddAccountSchema & { type: 'lend' | 'borrow' }>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      started: new Date(),
      type: 'lend',
      partner_email: undefined,
    },
  })

  const { status: fetchAccountDetailsStatus, data: fetchAccountDetails } = useQuery({
    queryFn: () => fetchLendingAccountById(id),
    queryKey: [LENDING.ACCOUNTS_DETAILS, id],
    enabled: !!id,
    staleTime: 0,
  })

  const editAccountMutation = useMutation({
    mutationFn: (dto: AddAccountSchema) => updateLendingAccount(id, dto),
    onSuccess: () => {
      reset()
      qc.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      toast.show({ render: () => Success('Account edited successfully!') })
      router.push('/lending')
    },
  })

  const inputs = useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Account Name',
          type: 'text',
          required: true,
        },
        {
          id: 'partner_email',
          label: 'Email',
          type: 'text',
        },
        {
          id: 'user_remark',
          label: 'Remarks',
          type: 'text',
        },
        {
          id: 'principal',
          label: 'Enter Amount',
          type: 'number',
          required: true,
        },
        {
          id: 'started',
          label: 'Choose the Date',
          type: 'date',
          required: true,
        },
      ] as InputField[],
    [],
  )

  useEffect(() => {
    if (fetchAccountDetailsStatus === 'success') {
      reset({
        ...fetchAccountDetails,
        partner_email: fetchAccountDetails?.partner_email ?? undefined,
        type: fetchAccountDetails?.balance < 0 ? 'borrow' : 'lend',
        started: new Date(fetchAccountDetails?.started),
      })
    }
  }, [fetchAccountDetails, fetchAccountDetailsStatus, reset])

  const handleEditLendingAccount = (values: AddAccountSchema & { type: 'lend' | 'borrow' }) => {
    const partner_email = getValues('partner_email')
    const user_remark = getValues('user_remark')
    const newAccount = {
      started: values.started,
      name: values.name,
      principal: calculateTransactionAmount(values.type, values.principal as number),
      partner_email,
      user_remark,
    }
    editAccountMutation.mutate(newAccount)
  }
  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.get()}>
      <View rowGap="$2.5">
        <InputFields control={control} errors={errors} inputs={inputs} />
      </View>

      <Button
        onPress={handleSubmit(handleEditLendingAccount)}
        isDisabled={editAccountMutation.isPending}
        isLoading={editAccountMutation.isPending}
        height={hp(5)}
        _text={{ style: { fontSize: FontSizes.size15 } }}
      >
        Update
      </Button>
    </VStack>
  )
}
