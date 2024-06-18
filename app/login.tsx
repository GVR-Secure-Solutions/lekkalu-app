import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Redirect } from 'expo-router'
import { Button, Checkbox, Input, Label, Stack, Text, XStack, YStack, useTheme } from 'tamagui'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { LoginSchema, loginSchema } from '../schema/auth'
import { useAuthContext } from '@/hooks/use-auth'
import FormControl from '@/components/form-control'
import { FontSizes } from '@/utils/fonts'
import { hp, wp } from '@/utils/responsive'
import GoogleSigninButton from '@/components/google-sign-in-button'

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_API_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
  webClientId: process.env.EXPO_PUBLIC_API_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
})

export default function Login() {
  const { isAuthenticated, loginMutation, loginWithGoogleMutation } = useAuthContext()
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const handleLogin = (values: LoginSchema) => {
    loginMutation.mutate(values)
  }

  // const handleForgotPassword = () => {
  //   router.push('/reset-password?isForgotPassword=true')
  // }

  if (isAuthenticated) {
    return <Redirect href="/dashboard" />
  }

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const data = await GoogleSignin.signIn()
      loginWithGoogleMutation.mutate({ code: data.serverAuthCode || '' })
    } catch (error: any) {
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('google services is not available')
      }
    }
  }

  return (
    <Stack flex={1} bg="$background" alignItems="center" justifyContent="center" p={wp(4)}>
      <YStack bg="$muted" w="100%" borderRadius={wp(4)} p={wp(4)} space={hp(2)}>
        <YStack space={hp(1)}>
          <Text fontSize={FontSizes.size48} fontFamily={'$heading'}>
            Log in
          </Text>
          <Text fontSize={FontSizes.size18} color={theme.colorFocus.get()}>
            Welcome back to finuncle!
          </Text>
        </YStack>

        <FormControl>
          <FormControl.Label fontSize={FontSizes.size15} isRequired>
            Username
          </FormControl.Label>

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input
                fontSize={FontSizes.size15}
                h={hp(5)}
                br={wp(1.8)}
                placeholder="Enter your username"
                onChangeText={field.onChange}
                {...field}
              />
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.username?.message}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
          <FormControl.Label fontSize={FontSizes.size15} isRequired>
            Password
          </FormControl.Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                fontSize={FontSizes.size15}
                h={hp(5)}
                br={wp(1.8)}
                secureTextEntry
                placeholder="Enter your password"
                onChangeText={field.onChange}
                {...field}
              />
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.password?.message}</FormControl.ErrorMessage>
        </FormControl>

        {/* <TouchableOpacity onPress={handleForgotPassword}>
          <Text textAlign="right" fontSize={FontSizes.size16} color={'$primary'}>
            Forgot Password ?
          </Text>
        </TouchableOpacity> */}

        <FormControl>
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <XStack my={hp(0.5)} alignItems="center" space={wp(3.4)}>
                <Checkbox
                  id="rememberMe"
                  h={wp(5)}
                  w={wp(5)}
                  br={wp(1.2)}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                >
                  <Checkbox.Indicator>
                    <CheckIcon size={wp(3)} />
                  </Checkbox.Indicator>
                </Checkbox>

                <Label fontSize={FontSizes.size15} htmlFor="rememberMe">
                  Remember Me
                </Label>
              </XStack>
            )}
          />

          <FormControl.ErrorMessage fontSize={FontSizes.size15}>{errors.rememberMe?.message}</FormControl.ErrorMessage>
        </FormControl>

        <Button
          fontSize={FontSizes.size15}
          h={hp(5.5)}
          onPress={handleSubmit(handleLogin)}
          disabled={loginMutation.isPending}
          bg="$primary"
          color="white"
        >
          Login
        </Button>
        {/* <GoogleSigninButton handleLogin={handleGoogleSignIn} /> */}        
        <Link href="/signup" asChild>
          <Button variant="outlined">
            <Text color="$color" fontSize={FontSizes.size15} ta="center">
              Don&rsquo;t have an account? Signup
            </Text>
          </Button>
        </Link>
      </YStack>
    </Stack>
  )
}
