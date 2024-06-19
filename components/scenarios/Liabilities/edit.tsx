import React, { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'
import { LIABILITIY_INPUTS_FOR_SCENARIO } from '@/utils/liabilities'
import useScenario from '@/hooks/use-scenario'
import { AddLiabilitySchema, addLiabilitySchema } from '@/schema/balance-sheet'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

type EditLiabilitiesForScenarioType = {
  id: number
  handleComplete: () => void
}

const EditLiabilitiesForScenario = ({ id, handleComplete }: EditLiabilitiesForScenarioType) => {
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])

  const { getAllScenarioEntitiesQuery, updateLiability, fetchLiabilityById } = useScenario()

  const { data } = useQuery({
    queryKey: [`${BALANCE_SHEET.LIABILITIES}-${id}-${IMAGINARY_USER?.username}`],
    queryFn: () => fetchLiabilityById(id),
    select: (data) => {
      return { ...data, disbursement_date: dayjs(data.disbursement_date).toDate() }
    },
    staleTime: 0,
  })

  const form = useForm<AddLiabilitySchema>({
    resolver: zodResolver(addLiabilitySchema),
    values: {
      ...data,
    },
  })

  const updateLiabilityMutation = useMutation({
    mutationFn: (dto: Partial<AddLiabilitySchema>) => updateLiability(id, dto),
  })

  const handleEdit = () => {
    updateLiabilityMutation.mutate({
      ...form.watch(),
      disbursement_date: dayjs(form.watch('disbursement_date')).format(SERVER_DATE_FORMAT),
    })
  }

  useEffect(() => {
    if (updateLiabilityMutation.isSuccess) {
      qc.invalidateQueries({
        queryKey: [
          `${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`,
          `${BALANCE_SHEET.LIABILITIES}-${id}-${IMAGINARY_USER?.username}`,
        ],
      })
      getAllScenarioEntitiesQuery.refetch()
      handleComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLiabilityMutation.isSuccess])

  return (
    <AddEditEntityForScenario
      isEdit
      entityName="Liabilities"
      form={form}
      inputs={LIABILITIY_INPUTS_FOR_SCENARIO}
      mutation={handleEdit}
      isLoading={updateLiabilityMutation.isPending}
      handleComplete={handleComplete}
    />
  )
}

export default EditLiabilitiesForScenario
