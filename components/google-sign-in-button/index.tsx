import { TouchableOpacity, Image } from 'react-native'
import { View, Text } from 'tamagui'
import { FontSizes } from '@/utils/fonts'

type GoogleSignInButtonType = {
  handleLogin: () => void
}

export default function GoogleSigninButton({ handleLogin }: GoogleSignInButtonType) {
  return (
    <TouchableOpacity onPress={handleLogin}>
      <View display="flex" flexDirection="row" backgroundColor={'$blue10'} padding={5} borderRadius={10}>
        <View backgroundColor={'white'} borderRadius={10} padding={5}>
          <Image source={require('assets/googleLogo.webp')} style={{ width: 25, height: 25 }} />
        </View>
        <View mx={'auto'} my={'auto'} alignSelf="center" flex={1}>
          <Text textAlign="center" color={'white'} fontSize={FontSizes.size15}>
            Login with Google
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
