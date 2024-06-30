import { useMemo } from 'react'
import { Button, VStack, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from 'expo-router'
import { View, useTheme } from 'tamagui'
import InputFields from '@/components/input-fields'
import { Success } from '@/utils/toast'
import { hp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { InputField } from '@/types/input-fields'
import { AddAccountSchema } from '@/types/lending'
import { addLendingAccount } from '@/queries/lending'
import { addAccountSchema } from '@/schema/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { TRANSACTION_TYPES, calculateTransactionAmount } from '@/utils/lending'

export default function CreateLendingAccount() {
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

  const createAccountMutation = useMutation({
    mutationFn: addLendingAccount,
    onSuccess: () => {
      reset()
      qc.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      toast.show({ render: () => Success('Account created successfully!') })
      router.push('/lending')
    },
  })

  const inputs = useMemo(
    () =>
      [
        {
          id: 'type',
          label: 'Select Type',
          type: 'select',
          options: TRANSACTION_TYPES,
        },
        {
          id: 'name',
          label: 'Account Name',
          type: 'text',
          required: true,
        },
        {
          id: 'partner_email',
          label: 'Account Email',
          type: 'text',
        },
        {
          id: 'principal',
          label: 'Enter Amount',
          type: 'number',
          required: true,
        },
        {
          id: 'user_remark',
          label: 'Remarks',
          type: 'text',
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

  const handleAddLendingAccount = (values: AddAccountSchema & { type: 'lend' | 'borrow' }) => {
    const partner_email = getValues('partner_email')
    const user_remark = getValues('user_remark')
    const newAccount = {
      started: values.started,
      name: values.name,
      principal: calculateTransactionAmount(values.type, values.principal as number),
      partner_email,
      user_remark,
    }
    createAccountMutation.mutate(newAccount)
  }

  return (
    <VStack flex={1} p={4} space={4} backgroundColor={theme.backgroundHover.get()}>
      <View rowGap="$2.5">
        <InputFields control={control} errors={errors} inputs={inputs} />
      </View>

      <Button
        onPress={handleSubmit(handleAddLendingAccount)}
        isDisabled={createAccountMutation.isPending}
        isLoading={createAccountMutation.isPending}
        height={hp(5)}
        _text={{ style: { fontSize: FontSizes.size15 } }}
      >
        Create
      </Button>
    </VStack>
  )
}
