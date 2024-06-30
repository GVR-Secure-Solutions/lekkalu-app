import { Tabs } from 'expo-router/tabs'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { Text, View, useTheme } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

import { hp, wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

const TabBarIcon = ({ focused, name }: { focused: boolean; name: React.ComponentProps<typeof AntDesign>['name'] }) => {
  const theme = useTheme()
  return <AntDesign name={name} size={wp(5)} color={focused ? theme.primary.get() : theme.color.get()} />
}

const TabBarLabel = ({ children, focused }: { children: string; focused: boolean }) => {
  const theme = useTheme()
  return (
    <Text
      textAlign="center"
      fontSize={FontSizes.size15}
      numberOfLines={1}
      color={focused ? theme.primary.get() : theme.color.get()}
    >
      {children}
    </Text>
  )
}

export default function AuthenticatedAppLayout() {
  const theme = useTheme()
  const { bottom, top } = useSafeAreaInsets()

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        tabBarStyle: {
          paddingTop: hp(1),
          paddingBottom: bottom + 4,
          height: hp(7.5) + bottom,
          backgroundColor: theme.background.get(),
          borderTopColor: 'transparent',
        },
        tabBarItemStyle: { paddingHorizontal: wp(2) },
        header: ({ options, route }) => {
          const showBackbutton = [
            'create-expense',
            'create-lending-account',
            'update-expense/[id]',
            'lending-account/[id]',
            'update-lending-account/[id]',
          ].includes(route.name)

          const backScreenKeys: Record<string, string> = {
            'create-expense': 'expenses',
            'update-expense/[id]': 'expenses',
            'create-lending-account': 'lending',
            'lending-account/[id]': 'lending',
            'update-lending-account/[id]': 'lending',
          }

          return (
            <>
              <View w="100%" h={wp(1)} bg="$background" pt={top} />
              <View fd="row" bg="$background" ai="center" px={wp(4)} py={hp(1.8)}>
                {showBackbutton && (
                  <TouchableOpacity onPress={() => router.push(backScreenKeys[route.name] as any)}>
                    <Entypo
                      name="chevron-thin-left"
                      size={wp(5)}
                      color={theme.foreground.get()}
                      style={{ marginRight: wp(4) }}
                    />
                  </TouchableOpacity>
                )}
                <Text color="$color" fontSize={FontSizes.size26} fontWeight="bold">
                  {options.title}
                </Text>
              </View>
            </>
          )
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="balance-sheet"
        options={{
          title: 'Balance Sheet',
          tabBarIcon: ({ focused }) => <TabBarIcon name="calculator" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ focused }) => <TabBarIcon name="wallet" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="lending"
        options={{
          title: 'Lend & Borrow',
          tabBarIcon: ({ focused }) => <TabBarIcon name="solution1" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabBarIcon name="setting" focused={focused} />,
          tabBarLabel: ({ focused, children }) => <TabBarLabel focused={focused}>{children}</TabBarLabel>,
        }}
      />
      <Tabs.Screen
        name="create-lending-account"
        options={{
          title: 'Create Lending Account',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="update-lending-account/[id]"
        options={{
          title: 'Edit Lending Account',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="create-expense"
        options={{
          title: 'Create Expense',
          href: null,
          unmountOnBlur: true,
        }}
      />

      <Tabs.Screen
        name="update-expense/[id]"
        options={{
          title: 'Update Expense',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="update-lending-transaction/[id]"
        options={{
          title: 'Update Lending Transaction',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="lending-account/[id]"
        options={{
          title: 'Account Transaction',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="income-statement"
        options={{
          title: 'Income Statement',
          href: null,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="emi-calculator"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="emi-calculator-breakdown"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="add-edit-income-expense"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="reset-password"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="submit-feedback"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="email-verify"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="add-goal"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="goal-details"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          href: null,
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  )
}
