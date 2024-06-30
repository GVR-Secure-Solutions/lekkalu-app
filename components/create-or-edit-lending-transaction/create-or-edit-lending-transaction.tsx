import { cloneElement, useEffect, useMemo, useState } from 'react'
import { Button, Modal, useToast } from 'native-base'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Text, useTheme } from 'tamagui'
import { useColorScheme } from 'react-native'
import InputFields from '../input-fields'
import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { InputField } from '@/types/input-fields'
import { PAYMENT_METHODS, TRANSACTION_TYPES, calculateTransactionAmount } from '@/utils/lending'
import { LENDING } from '@/utils/query-keys/lending'
import { addLendingTransaction, updateLendingTransaction } from '@/queries/lending'
import { AddTransactionSchema, Transaction } from '@/types/lending'
import { addTransactionSchema } from '@/schema/lending'

type CreateOrEditTransactionProps = {
  trigger: React.ReactElement<{ onPress: () => void }>
  transaction?: Transaction
  lending_account: string
}

export default function CreateOrEditLendingAccount({
  lending_account,
  trigger,
  transaction,
}: CreateOrEditTransactionProps) {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const qc = useQueryClient()
  const isEdit = Boolean(transaction)
  const title = isEdit ? 'Edit Transaction' : 'Create Transaction'
  const theme = useTheme()
  const systemTheme = useColorScheme()
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    reset,
  } = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      type: Number(transaction?.amount ?? 0) < 0 ? 'borrow' : 'lend',
      amount: Number(transaction?.amount),
      time: transaction?.time ? new Date(transaction.time) : new Date(),
      payment_method: transaction?.payment_method,
      reference_no: transaction?.reference_no,
      note: transaction?.note,
    },
  })

  const addLendingAccountMutation = useMutation({
    mutationFn: addLendingTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LENDING.TRANSACTIONS] })
      qc.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      toast.show({ title: 'Transaction created successfully!' })
      setShowModal(false)
      reset()
    },
    onError: () => {
      reset()
      setShowModal(false)
      toast.show({ title: 'Failed to create transaction' })
    },
  })
  const editLendingAccountMutation = useMutation({
    mutationFn: (dto: Omit<AddTransactionSchema, 'type'>) => updateLendingTransaction(transaction?.id!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LENDING.TRANSACTIONS] })
      qc.invalidateQueries({ queryKey: [LENDING.ACCOUNTS] })
      toast.show({ title: 'Transaction updated successfully!' })
      setShowModal(false)
    },
    onError: () => {
      setShowModal(false)
      toast.show({ title: 'Failed to update transaction' })
    },
  })

  const handleAddOrEditTransaction = (values: AddTransactionSchema) => {
    const { type, ...rest } = getValues()
    const valuesToSubmit = {
      ...rest,
      lending_account,
      amount: calculateTransactionAmount(type, values.amount as number)?.toString(),
    }
    if (isEdit) {
      editLendingAccountMutation.mutate({ ...valuesToSubmit, amount: Number(values.amount), id: transaction?.id })
      return
    }
    addLendingAccountMutation.mutate(valuesToSubmit)
  }

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
          id: 'amount',
          label: 'Amount',
          type: 'number',
          required: true,
        },
        {
          id: 'time',
          label: 'Date',
          type: 'date',
          defaultDate: new Date(),
          required: true,
        },
        {
          id: 'payment_method',
          label: 'Payment Method',
          type: 'select',
          options: PAYMENT_METHODS,
        },
        {
          id: 'reference_no',
          label: 'Enter Reference No',
          type: 'text',
          helpText: 'Enter a reference number for this transaction if available.',
        },
        {
          id: 'note',
          label: 'Enter Note',
          type: 'text',
          helpText: 'Add any additional notes or details for this transaction.',
        },
      ] as InputField[],
    [],
  )
  const handleClose = () => {
    setShowModal(false)
    reset()
  }

  useEffect(() => {
    if (isEdit) {
      reset({
        type: Number(transaction?.amount ?? 0) < 0 ? 'borrow' : 'lend',
        amount: Number(transaction?.amount),
        time: transaction?.time ? new Date(transaction.time) : new Date(),
        payment_method: transaction?.payment_method,
        reference_no: transaction?.reference_no,
        note: transaction?.note,
      })
    }
  }, [isEdit, transaction, reset])

  return (
    <>
      {cloneElement(trigger, {
        onPress: () => {
          setShowModal(true)
        },
      })}

      <Modal avoidKeyboard isOpen={showModal} onClose={handleClose} size="full">
        <Modal.Content height={'75%'} width={'94%'} bg={theme.background.get()}>
          <Modal.CloseButton _icon={{ size: wp(4) }} />
          <Modal.Header bg={theme.background.get()}>
            <Text fontFamily={'$heading'} fontSize={FontSizes.size20} color={theme.foreground.get()}>
              {title}
            </Text>
          </Modal.Header>

          <Modal.Body style={{ rowGap: hp(1) }}>
            <InputFields control={control} errors={errors} inputs={inputs} />
            {/* <Accordion overflow="hidden" width="100%" type="multiple">
              <Accordion.Item value="a1">
                <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                  {({ open }: { open: boolean }) => (
                    <>
                      <Paragraph>Advance options</Paragraph>
                      <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                        <ChevronDown size="$1" />
                      </Square>
                    </>
                  )}
                </Accordion.Trigger>
                <Accordion.Content animation="bouncy" exitStyle={{ opacity: 0 }}>
                  <InputFields control={control} errors={errors} inputs={advancedInputs} />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion> */}
          </Modal.Body>

          <Modal.Footer bg={theme.background.get()}>
            <Button.Group space={2}>
              <Button
                _text={{
                  style: {
                    fontSize: FontSizes.size15,
                    color: systemTheme === 'dark' ? 'white' : THEME_COLORS.primary[600],
                  },
                }}
                height={hp(4.5)}
                px={wp(4)}
                variant="ghost"
                onPress={handleClose}
              >
                Cancel
              </Button>
              <Button
                _text={{ style: { fontSize: FontSizes.size15 } }}
                px={wp(4)}
                onPress={handleSubmit(handleAddOrEditTransaction)}
                isDisabled={addLendingAccountMutation.isPending || editLendingAccountMutation.isPending}
                isLoading={addLendingAccountMutation.isPending || editLendingAccountMutation.isPending}
              >
                {isEdit ? 'Update' : 'Add'}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}
