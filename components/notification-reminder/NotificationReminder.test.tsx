import { render } from '@testing-library/react-native'
import React from 'react'
import { TamaguiProvider, Text } from 'tamagui'
import NotificationReminder from './NotificationReminder'
import config from '@/tamagui.config'
import renderer from 'react-test-renderer';

describe('NotificationReminder', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<TamaguiProvider config={config}><NotificationReminder /></TamaguiProvider>)
    const component = toJSON()
    expect(component).toMatchSnapshot()
  })

  it('has 1 child', () => {
    const tree = renderer
      .create(
        <TamaguiProvider config={config}>
          <NotificationReminder />
        </TamaguiProvider>,
      )
      .toJSON()

    expect(Array.isArray(tree) ? tree.length : 1).toBe(1)
  })
})
