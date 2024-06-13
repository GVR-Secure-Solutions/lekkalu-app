import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import useScenario from '@/hooks/use-scenario'
import { AddPhysicalAssetSchemaForScenario, addPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import { ASSET_INPUTS_FOR_SCENARIO } from '@/components/create-or-edit-asset/config'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { SERVER_DATE_FORMAT } from '@/utils/constants'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'

type TAssetForScenario = {
  handleComplete: () => void
}

const AssetForScenario = ({ handleComplete }: TAssetForScenario) => {
  const qc = useQueryClient()
  const imaginaryUser = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])
  const form = useForm<AddPhysicalAssetSchemaForScenario>({
    resolver: zodResolver(addPhysicalAssetSchemaForScenario),
  })

  const { addPhysicalAssetMutation } = useScenario()

  const handleAdd = () => {
    try {
      const values = { ...form.watch() }
      addPhysicalAssetMutation.mutate({
        ...form.watch(),
        purchase_date: dayjs(values.purchase_date).format(SERVER_DATE_FORMAT),
        sell_date: dayjs(values.sell_date).format(SERVER_DATE_FORMAT),
        depreciation_percent: Number(form.getValues('depreciation_percent')),
        init_dep: Number(values.init_dep),
        market_value: Number(values.market_value),
        purchase_value: Number(values.purchase_value),
        sell_value: Number(values.sell_value),
        tags: [],
        type: 1,
      })
    } catch (e) {
      console.log('There was an error', e)
    }
  }

  useEffect(() => {
    if (addPhysicalAssetMutation?.isSuccess) {
      handleComplete()
      qc.invalidateQueries({
        queryKey: [`${BALANCE_SHEET.ASSETS}-${imaginaryUser?.username}`],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPhysicalAssetMutation?.isSuccess])

  return (
    <AddEditEntityForScenario
      form={form}
      inputs={ASSET_INPUTS_FOR_SCENARIO}
      entityName="Asset"
      mutation={handleAdd}
      isLoading={addPhysicalAssetMutation.isPending}
      handleComplete={handleComplete}
    />
  )
}

export default AssetForScenario
