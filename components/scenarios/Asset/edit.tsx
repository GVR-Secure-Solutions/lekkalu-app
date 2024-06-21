import React, { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import AddEditEntityForScenario from '../Entity/AddEditEntity'
import { ASSET_INPUTS_FOR_SCENARIO } from '@/components/create-or-edit-asset/config'
import { ImaginaryUserType } from '@/app/(authenticated)/scenarios/[id]'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import { AddPhysicalAssetSchemaForScenario, addPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'
import useScenario from '@/hooks/use-scenario'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { SERVER_DATE_FORMAT } from '@/utils/constants'

type EditAssetForScenarioType = {
  id: number
  handleComplete: () => void
}

const EditAssetForScenario = ({ id, handleComplete }: EditAssetForScenarioType) => {
  const qc = useQueryClient()
  const IMAGINARY_USER = qc.getQueryData<ImaginaryUserType>([AUTH.CURRENT_IMAGINARY_USER])

  const { getAllScenarioEntitiesQuery, fetchPhysicalAssetsById, updatePhysicalAsset } = useScenario()

  const { data } = useQuery({
    queryKey: [`${BALANCE_SHEET.ASSETS}-${id}-${IMAGINARY_USER?.username}`],
    queryFn: () => fetchPhysicalAssetsById(id),
    staleTime: 0,
    select: (data) => {
      return {
        ...data,
        purchase_date: data.purchase_date ? dayjs(data.purchase_date).toDate() : data.purchase_date,
        sell_date: data.sell_date ? dayjs(data.sell_date).toDate() : data.sell_date,
      }
    },
  })

  const form = useForm<AddPhysicalAssetSchemaForScenario>({
    resolver: zodResolver(addPhysicalAssetSchemaForScenario),
    values: { ...data },
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (dto: Partial<AddPhysicalAssetSchemaForScenario>) => updatePhysicalAsset(id, dto),
  })

  const handleEdit = () => {
    const values = {
      ...form.watch(),
      sell_date: form.watch('sell_date')
        ? dayjs(form.watch('sell_date')).format(SERVER_DATE_FORMAT)
        : form.watch('sell_date'),
      purchase_date: form.watch('purchase_date')
        ? dayjs(form.watch('purchase_date')).format(SERVER_DATE_FORMAT)
        : form.watch('purchase_date'),
    } as unknown as AddPhysicalAssetSchemaForScenario
    mutate(values)
  }

  useEffect(() => {
    if (isSuccess) {
      qc.invalidateQueries({
        queryKey: [
          `${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`,
          `${BALANCE_SHEET.ASSETS}-${id}-${IMAGINARY_USER?.username}`,
        ],
      })
      getAllScenarioEntitiesQuery.refetch()
      handleComplete()
    }
  }, [isSuccess])

  return (
    <AddEditEntityForScenario
      isEdit
      entityName="Asset"
      form={form}
      inputs={ASSET_INPUTS_FOR_SCENARIO}
      mutation={handleEdit}
      isLoading={isPending}
      handleComplete={handleComplete}
    />
  )
}

export default EditAssetForScenario
