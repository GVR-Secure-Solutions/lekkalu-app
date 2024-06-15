import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View, useTheme } from 'tamagui'
import { PieChart } from 'react-native-gifted-charts'
import { useNavigation, router } from 'expo-router'
import dayjs from 'dayjs'

import { hp, wp } from '@/utils/responsive'
import { THEME_COLORS } from '@/utils/theme'
import { FontSizes } from '@/utils/fonts'
import { GoalItemType, useDeleteGoal, useGetGoalProgress } from '@/queries/goal'
import EditDeleteMenu from '../edit-delete-menu'
import DisplayItem from './display-item'

export const ChartCenterLabel: FC<{ value: number }> = ({ value }) => {
    return (
        <View bg="$backgroundHover" ai="center" rowGap={wp(2)} px={wp(1)} br={wp(50)}>
            <Text
                color="$foreground"
                numberOfLines={2}
                textAlign="center"
                adjustsFontSizeToFit
                fontSize={FontSizes.size12}
                fontFamily="$heading"
            >
                {value}%
            </Text>
        </View>
    )
}

interface GoalItemProps {
    data: GoalItemType
}

const GoalItem: FC<GoalItemProps> = (props) => {
    const {
        id,
        name,
        created_at,
        track_kpi
    } = props.data
    const theme = useTheme()
    const navigation = useNavigation()
    const { data: goalProgressQueryData } = useGetGoalProgress(id)
    const { mutate: mutateDeleteGoal } = useDeleteGoal()

    const progressValue = Math.min(
        Math.abs(
            +parseFloat(
                goalProgressQueryData?.data?.progress_percent ? goalProgressQueryData?.data?.progress_percent.toString() : '0',
            ).toFixed(2),
        ),
        100,
    )

    const data = [
        {
            value: progressValue,
            color: THEME_COLORS.violet[500],
        },
        {
            value: 100 - progressValue,
            color: 'lightgray'
        },
    ]

    const handleNavigateGoalDetails = () => {
        navigation.navigate('goal-details', { id })
    }

    const handleOnPressEditGoal = () => {
        router.push({
            pathname: '/(authenticated)/add-goal',
            params: {
                edit: true,
                goalDetails: JSON.stringify(props.data)
            },
        })
    }

    const handleOnPressDeleteGoal = () => {
        mutateDeleteGoal(id)
    }

    return (
        <TouchableOpacity
            onPress={handleNavigateGoalDetails}
            style={[styles.container, { backgroundColor: theme.background.get() }]}
        >
            <PieChart
                data={data}
                donut
                centerLabelComponent={() => <ChartCenterLabel value={progressValue}/>}
                radius={wp(8)}
                innerRadius={wp(6)}
                innerCircleColor={theme.backgroundHover.get()}
            />
            <DisplayItem name={name} track_kpi={track_kpi} created_at={dayjs(created_at).fromNow()}/>
            <View als={'flex-start'}>
                <EditDeleteMenu onEdit={handleOnPressEditGoal} onDelete={handleOnPressDeleteGoal}/>
            </View>
        </TouchableOpacity>
    )
}

export default GoalItem

const styles = StyleSheet.create({
    container: {
        borderLeftWidth: wp(0.5),
        borderLeftColor: THEME_COLORS.violet[500],
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        borderRadius: wp(2),
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: {
            height: 0,
            width: 0
        },
        shadowRadius: wp(1),
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: wp(4),
    },
})
