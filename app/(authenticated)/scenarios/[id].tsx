/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { fetchScenarioById } from '@/queries/scenario'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import AddButtonForScenario from '@/components/scenarios/AddButton'
import ExpensesForScenario from '@/components/scenarios/Expenses/add'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import ListEntity from '@/components/scenarios/Entity/ListEntity'
import useScenario from '@/hooks/use-scenario'
import AssetForScenario from '@/components/scenarios/Asset'
import LiabilitiesForScenario from '@/components/scenarios/Liabilities'
import EditExpenseForScenario from '@/components/scenarios/Expenses/edit'

export type ScenarioEntities = 'Asset' | 'Liabilities' | 'Expense'

export type ImaginaryUserType = {
  access: string
  id: string
  refresh: string
  username: string
}

export default function ScenarioWithId() {
  const [entityToAdd, setEntityToAdd] = useState<ScenarioEntities>()
  const [entityToEdit, setEntityToEdit] = useState<{ type: ScenarioEntities; id: number }>()
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const scenarioId = +params.id

  const qc = useQueryClient()

  const { loginImaginaryUser } = useImaginaryAuth()
  const IMAGINARY_USER = qc.getQueryData<any>([AUTH.IMAGINARY_CLIENT])

  const { data: scenario, isSuccess } = useQuery({
    queryKey: [`${SCENARIO.SCENARIO}-${scenarioId}`],
    queryFn: () => fetchScenarioById(scenarioId),
  })

  useEffect(() => {
    return () => {
      qc.invalidateQueries({
        queryKey: [
          `${INCOME_STATEMENT_QUERY_KEYS.INCOME_EXPENSE}-${IMAGINARY_USER?.username}`,
          `${BALANCE_SHEET.LIABILITIES}-${IMAGINARY_USER?.username}`,
          `${SCENARIO.SCENARIO_ENTITIES}-${IMAGINARY_USER?.username}`,
          `${AUTH.CURRENT_IMAGINARY_USER}`,
          `${AUTH.IMAGINARY_CLIENT}`,
        ],
      })
    }
  }, [])

  useEffect(() => {
    if (isSuccess) {
      loginImaginaryUser.mutate({ username: scenario.imag_username, password: scenario.imag_password, id: scenario.id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const handleAddPress = (entity: ScenarioEntities) => {
    setEntityToAdd(entity)
  }

  const handleAddComplete = () => {
    setEntityToAdd(undefined)
  }

  const handleEditComplete = () => {
    setEntityToEdit(undefined)
  }

  const { getAllScenarioEntitiesQuery } = useScenario()

  const EntityDialogToAddEntity = () => {
    switch (entityToAdd) {
      case 'Asset': {
        return <AssetForScenario handleComplete={handleAddComplete} />
      }
      case 'Expense': {
        return <ExpensesForScenario handleComplete={handleAddComplete} />
      }
      case 'Liabilities': {
        return <LiabilitiesForScenario handleComplete={handleAddComplete} />
      }
      default: {
        return <></>
      }
    }
  }

  const EntityDialogToEditEntity = () => {
    switch (entityToEdit?.type) {
      case 'Asset':
        return <></>
      case 'Expense':
        return <EditExpenseForScenario id={entityToEdit?.id} handleComplete={handleEditComplete} />
      case 'Liabilities':
        return <></>
      default:
        return <></>
    }
  }

  if (loginImaginaryUser.isPending) {
    return (
      <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
        <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
          <BackButton onPress={() => router.push('/(authenticated)/scenarios/')} />
          <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
            Please wait.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
        <BackButton onPress={() => router.push('/(authenticated)/scenarios/')} />
        <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
          {scenario?.name}
        </Text>
      </View>
      <ListEntity
        data={getAllScenarioEntitiesQuery.data}
        isLoading={getAllScenarioEntitiesQuery?.isLoading}
        refetch={getAllScenarioEntitiesQuery?.refetch}
        handleEdit={setEntityToEdit}
      />
      {EntityDialogToAddEntity()}
      {EntityDialogToEditEntity()}
      <AddButtonForScenario handlePress={handleAddPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
    rowGap: hp(1.5),
    paddingBottom: hp(5),
  },
})
