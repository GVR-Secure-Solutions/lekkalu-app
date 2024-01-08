import { useNavigation } from 'expo-router/src/useNavigation'
import { Button } from 'native-base'
import { View, Text } from 'tamagui'

export default function Dashboard() {
  const navigation  = useNavigation()
  const CAGRCalculator = () => {
    console.log("object")
    // return <Redirect href="/cagrcalculator" />
    navigation.navigate('cagrcalculator')
  }
  return (
    <View p="$4" flex={1} bg="$background">
      <Text>Dashboard</Text>
      <View p={4}>
      <Button onPress={() => CAGRCalculator()}>CAGR Calculator</Button>
      </View>
    </View>
  )
}
