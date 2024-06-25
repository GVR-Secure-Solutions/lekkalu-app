import React, { FC, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Modal } from 'native-base'
import { View, useTheme, Text, Button } from 'tamagui'
import { Menu, MenuItem } from 'react-native-material-menu'
import { Feather } from '@expo/vector-icons'
import { wp } from '@/utils/responsive'
import { FontSizes } from '@/utils/fonts'

interface EditDeleteMenuProps {
  onEdit?: () => void
  onDelete?: () => void
  extraMenus?: Array<{ style?: {}; name: string; onPress: () => void }>
}

const EditDeleteMenu: FC<EditDeleteMenuProps> = (props) => {
  const { onDelete, onEdit } = props

  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [viewDeleteDialog, setViewDeleteDialog] = useState(false)

  const showMenu = () => {
    setVisible(true)
  }

  const hideMenu = () => {
    setVisible(false)
  }

  const handleEditPress = () => {
    onEdit?.()
    hideMenu()
  }

  useEffect(() => {
    return () => {
      setViewDeleteDialog(false)
    }
  }, [])

  const handleDeletePress = () => {
    onDelete?.()
    hideMenu()
  }
  return (
    <>
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <Feather size={wp(4)} name="more-vertical" color={theme.foreground.get()} />
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
        style={{ backgroundColor: theme.backgroundHover.get() }}
      >
        <MenuItem textStyle={{ color: theme.foreground.get(), fontSize: FontSizes.size16 }} onPress={handleEditPress}>
          Edit
        </MenuItem>
        <MenuItem
          textStyle={{ color: 'red', fontSize: FontSizes.size16 }}
          onPress={() => {
            setViewDeleteDialog(true)
            setVisible(false)
          }}
        >
          Delete
        </MenuItem>
        {props.extraMenus ? (
          props.extraMenus?.map((each) => (
            <MenuItem
              key={each?.name}
              textStyle={{ color: theme.foreground.get(), ...each?.style }}
              onPress={each?.onPress}
            >
              {each?.name}
            </MenuItem>
          ))
        ) : (
          <></>
        )}
      </Menu>
      <Modal isOpen={viewDeleteDialog} onClose={() => setViewDeleteDialog(false)}>
        <Modal.Content>
          <Modal.Body background={theme.background.get()}>
            <View>
              <Text color={theme.foreground.get()} fontSize={FontSizes.size15}>
                Are you sure you want to delete this?
              </Text>
            </View>
            <View f={1} fd={'row'} gap={'$5'} mt={'$3'}>
              <Button onPress={() => setViewDeleteDialog(false)} f={1}>
                Cancel
              </Button>
              <Button onPress={handleDeletePress} backgroundColor={'$primary'} f={1}>
                Confirm
              </Button>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default EditDeleteMenu
