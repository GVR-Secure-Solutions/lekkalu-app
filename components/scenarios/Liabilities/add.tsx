import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AddLiabilitySchema, addLiabilitySchema } from '@/schema/balance-sheet'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import { LIABILITIY_INPUTS_FOR_SCENARIO } from '@/utils/liabilities'
import useScenario from '@/hooks/use-scenario'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'
import { AUTH } from '@/utils/query-keys'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

type TLiabilityForScenario = {
  handleComplete: () => void
}

const LiabilitiesForScenario = ({ handleComplete }: TLiabilityForScenario) => {
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])
  const form = useForm<AddLiabilitySchema>({
    resolver: zodResolver(addLiabilitySchema),
    defaultValues: {
      balance: '0',
      emi_day: '1',
      emi: '0',
      closure_charges: '0',
    },
  })

  const { getAllScenarioEntitiesQuery, addLiabilityMutation } = useScenario()

  const handleAdd = () => {
    try {
      const values = {
        ...form.watch(),
        disbursement_date: dayjs(form.watch('disbursement_date')).format(SERVER_DATE_FORMAT),
        balance: Number(form.watch('balance')),
        emi_day: Number(form.watch('emi_day')),
        closure_charges: Number(form.watch('closure_charges')),
      } as unknown as AddLiabilitySchema

      addLiabilityMutation.mutate(values)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (addLiabilityMutation.isSuccess) {
      handleComplete()
      qc.invalidateQueries({
        queryKey: [`${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`],
      })
      getAllScenarioEntitiesQuery.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLiabilityMutation?.isSuccess])

  return (
    <AddEditEntityForScenario
      entityName="Liabilities"
      form={form}
      inputs={LIABILITIY_INPUTS_FOR_SCENARIO}
      mutation={handleAdd}
      isLoading={addLiabilityMutation.isPending}
      handleComplete={handleComplete}
    />
  )
}

export default LiabilitiesForScenario
