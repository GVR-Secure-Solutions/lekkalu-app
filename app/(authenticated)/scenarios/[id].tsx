import React, { useEffect, useState } from 'react'
import { BackHandler, Share } from 'react-native'
import { View, Text } from 'tamagui'
import { useToast } from 'native-base'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SCENARIO } from '@/utils/query-keys/scenarios'
import { deleteScenario, editScenario, fetchScenarioById, fetchScenarios } from '@/queries/scenario'
import { hp, wp } from '@/utils/responsive'
import BackButton from '@/components/back-button'
import { FontSizes } from '@/utils/fonts'
import { useImaginaryAuth } from '@/hooks/use-imaginary-auth'
import AddButtonForScenario from '@/components/scenarios/AddButton'
import { INCOME_STATEMENT_QUERY_KEYS } from '@/utils/query-keys/income-statement'
import { AUTH, BALANCE_SHEET } from '@/utils/query-keys'
import ListEntity from '@/components/scenarios/Entity/ListEntity'
import useScenario from '@/hooks/use-scenario'
import AddAssetForScenario from '@/components/scenarios/Asset/add'
import AddLiabilitiesForScenario from '@/components/scenarios/Liabilities/add'
import EditLiabilitiesForScenario from '@/components/scenarios/Liabilities/edit'
import AddExpensesForScenario from '@/components/scenarios/Expenses/add'
import EditExpenseForScenario from '@/components/scenarios/Expenses/edit'
import EditAssetForScenario from '@/components/scenarios/Asset/edit'
import PrivacyButtonForScenario from '@/components/scenarios/PrivacyButton'
import { AddScenarioSchemas } from '@/schema/scenarios'
import EditDeleteMenu from '@/components/edit-delete-menu/edit-delete-menu'
import useRerouteUnAuthenticatedUser from '@/hooks/use-reroute-unauthenticated-users'
import { WEB_URL } from '@/utils/constant/constant'

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
  const [showChangePrivacyDialog, setShowChangePrivacyDialog] = useState(false)
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()
  const scenarioId = +params.id

  useRerouteUnAuthenticatedUser({ pathname: '/scenario', params: { id: scenarioId } })

  const toast = useToast()

  const qc = useQueryClient()

  const { loginImaginaryUser } = useImaginaryAuth()
  const IMAGINARY_USER = qc.getQueryData<any>([AUTH.IMAGINARY_CLIENT])

  const { data: scenario, isSuccess } = useQuery({
    queryKey: [`${SCENARIO.SCENARIO}-${scenarioId}`],
    queryFn: () => fetchScenarioById(scenarioId),
    staleTime: 0,
  })

  const {
    mutate,
    isSuccess: isEditSuccess,
    isPending,
  } = useMutation({
    mutationFn: (value: Partial<AddScenarioSchemas>) => editScenario(scenarioId, value),
  })

  const { mutate: deleteMutation, isPending: isDeletingScenario } = useMutation({
    mutationFn: deleteScenario,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCENARIO.SCENARIO] })
      router.push('/(authenticated)/scenarios/')
    },
  })

  const handleDelete = () => {
    deleteMutation(scenarioId)
  }

  function handleBack() {
    if (params.backToComparison) {
      router.push(`/(authenticated)/comparisons/${params.backToComparison}`)
    } else {
      router.push('/(authenticated)/scenarios/')
    }
    return true
  }

  const handleEditPrivacy = () => {
    mutate({ access: scenario?.access === 'Private' ? 'Public' : 'Private' })
  }

  useEffect(() => {
    if (isEditSuccess) {
      qc.invalidateQueries({
        queryKey: [`${SCENARIO.SCENARIO}-${scenarioId}`],
      })
      qc.prefetchQuery({
        queryKey: [`${SCENARIO.SCENARIO}`],
        queryFn: fetchScenarios,
      })
      toast.show({ title: 'Privacy changed successfully' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditSuccess])

  useEffect(() => {
    const backButtonPress = BackHandler.addEventListener('hardwareBackPress', handleBack)

    return () => backButtonPress.remove()
  }, [])

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
      qc.setQueryData([AUTH.IMAGINARY_CLIENT], {})
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

  const { getAllScenarioEntitiesQuery } = useScenario(scenarioId)

  const EntityDialogToAddEntity = () => {
    switch (entityToAdd) {
      case 'Asset': {
        return <AddAssetForScenario handleComplete={handleAddComplete} />
      }
      case 'Expense': {
        return <AddExpensesForScenario handleComplete={handleAddComplete} />
      }
      case 'Liabilities': {
        return <AddLiabilitiesForScenario handleComplete={handleAddComplete} />
      }
      default: {
        return <></>
      }
    }
  }

  const EntityDialogToEditEntity = () => {
    switch (entityToEdit?.type) {
      case 'Asset':
        return <EditAssetForScenario id={entityToEdit?.id} handleComplete={handleEditComplete} />
      case 'Expense':
        return <EditExpenseForScenario id={entityToEdit?.id} handleComplete={handleEditComplete} />
      case 'Liabilities':
        return <EditLiabilitiesForScenario id={entityToEdit?.id} handleComplete={handleEditComplete} />
      default:
        return <></>
    }
  }

  const handleShare = async () => {
    const link = `${WEB_URL}/scenarios/${scenarioId}`
    await Share.share({
      title: scenario?.name,
      url: link,
      message: link,
    })
  }

  if (loginImaginaryUser.isPending) {
    return (
      <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
        <View fd="row" ai="center" columnGap={wp(4)} mx={wp(5)}>
          <BackButton onPress={handleBack} />
          <Text fontSize={FontSizes.size20} fontFamily={'$heading'}>
            Please wait.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View f={1} pt={insets.top + hp(2)} bg="$backgroundHover">
      <View fd="row" ml={wp(5)} mr={wp(14)}>
        <View fd="row" columnGap={wp(4)}>
          <BackButton onPress={handleBack} />
          <Text fontSize={FontSizes.size20} fontFamily={'$heading'} w={'83%'} alignSelf="center">
            {scenario?.name}
          </Text>
        </View>
        <View fd="row" alignItems="center">
          <PrivacyButtonForScenario
            showDialog={showChangePrivacyDialog}
            setShowDialog={setShowChangePrivacyDialog}
            isPublic={scenario?.access === 'Public'}
            handleMutation={handleEditPrivacy}
            isSuccess={isEditSuccess}
            isLoading={isPending}
            name="scenario"
          />
          <EditDeleteMenu
            onDelete={handleDelete}
            isDeleting={isDeletingScenario}
            size={wp(5)}
            extraMenus={[
              { name: 'Share', onPress: handleShare },
              {
                name: `Set to ${scenario?.access === 'Public' ? 'private' : 'public'}`,
                onPress: () => setShowChangePrivacyDialog(true),
              },
            ]}
          />
        </View>
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
