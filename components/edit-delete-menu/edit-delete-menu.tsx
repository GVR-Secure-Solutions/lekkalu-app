import React, { FC, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useTheme } from 'tamagui'
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

  const handleDeletePress = () => {
    onDelete?.()
    hideMenu()
  }
  return (
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
      <MenuItem textStyle={{ color: 'red', fontSize: FontSizes.size16 }} onPress={handleDeletePress}>
        Delete
      </MenuItem>
      {props.extraMenus ? (
        props.extraMenus?.map((each) => (
          <MenuItem key={each?.name} textStyle={each?.style} onPress={each?.onPress}>
            {each?.name}
          </MenuItem>
        ))
      ) : (
        <></>
      )}
    </Menu>
  )
}

export default EditDeleteMenu
