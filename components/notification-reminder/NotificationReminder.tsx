import React, { useEffect, useState } from 'react'
import { Dimensions, Linking, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { Dialog, Text, View } from 'tamagui'
import { FontSizes } from '@/utils/fonts'
import { THEME_COLORS } from '@/utils/theme'
import { wp } from '@/utils/responsive'
import { getData, storeData } from '@/utils/storage/storageHelpers'
import { storageKeys } from '@/utils/storage/storageKeys'
const { width } = Dimensions.get('window')

export default function NotificationReminder() {
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    checkAndSetReminder()
  }, [])

  const checkAndSetReminder = async () => {
    try {

      const isAllow = await getData(storageKeys.NOTIFICATION_PERMISSION_RESPONSE)

      const { status } = await Notifications.requestPermissionsAsync()
      console.log(status)

      if (status !== 'granted' && isAllow != 'false') {
        setShowModal(true)
        return
      }
      
      if(status !== 'granted') {
        return ;
      }

      await setReminder()
    } catch (error) {
      console.error('Error checking reminder:', error)
    }
  }

  // Add listener for notification press based on channel ID
  Notifications.addNotificationResponseReceivedListener((response) => {
    // Check the channel ID and perform actions accordingly
  })

  const openSettings = () => {
    setShowModal(false);
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      Linking.openSettings()
    }
  }

  const setReminder = async () => {
    try {
      // let token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log('token',token);

      const allNotifications = await Notifications.getAllScheduledNotificationsAsync()
      console.log(allNotifications)

      const isExist = await getData(storageKeys.EXPENCES_NOTIFICATION_STATUS);

      if (!isExist) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Record Your Expenses',
            body: 'Kindly log your expenses in Finuncle to keep track of your finances efficiently.',
            color: "#0F4B8F"
          },
          trigger: {            
            weekday:2,
            hour:7,
            minute:0,            
            repeats: true,
          },
        })
        console.log('Notification added')
        await storeData(storageKeys.EXPENCES_NOTIFICATION_STATUS,'true')
      } else {
        console.log('Already have')
      }
    } catch (error) {
      console.error('Error setting reminder:', error)
    }
  }

  const deniedPress = async () => {
    try {
      setShowModal(false)
      await storeData(storageKeys.NOTIFICATION_PERMISSION_RESPONSE,'false')
    } catch (error) {
      console.error('Error canceling reminder:', error)
    }
  }

  return (
    <>
      <Dialog modal open={showModal}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" onPress={() => {}} />

          <Dialog.Content bordered elevate key="content" gap={wp(2)}>
            <Dialog.Title>
              <View flexDirection="row" justifyContent="space-between" width={width - 60} alignItems="center">
                <Text fontSize={FontSizes.size24}>Permission Required</Text>
              </View>
            </Dialog.Title>
            <View backgroundColor={'white'} borderRadius={0}>
              <Text marginBottom={10} fontSize={FontSizes.size17}>
                This app requires notification permissions to function properly.
              </Text>
              <View flexDirection="row" alignSelf="flex-end" gap={12} marginTop={10}>
                <Text
                  fontSize={FontSizes.size16}
                  onPress={() => {
                    deniedPress()
                  }}
                >
                  Don't allow
                </Text>
                <Text fontSize={FontSizes.size16} color={THEME_COLORS.brand[900]} onPress={() => openSettings()}>
                  Allow
                </Text>
              </View>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
