import { Box, VStack, View } from 'native-base'
import { Slider } from 'tamagui'

type SliderProps = {
  defaultValue?: number,
  maxValue?: number,
  minValue?: number,
  onChange?: void,
}

export default function CommoneSlider({ defaultValue, maxValue, minValue, onChange }: SliderProps) {
  return (
    <View alignItems="center" justifyContent="center">
      <Box alignItems="center" w="100%">
        <VStack space={4} w="100%" maxW="300">
          <Slider size="$1" width={"100%"} defaultValue={[defaultValue]} max={maxValue} min={minValue} step={1} onValueChange={(val)=>onChange(parseInt(val))} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
    <Slider.Track style={{ backgroundColor: "#e1e1e1" }}>
      <Slider.TrackActive style={{ backgroundColor: "#003562" }}/>
    </Slider.Track>
    <Slider.Thumb circular index={0} style={{ backgroundColor: "#003562", borderColor: "#003562" }}/>
  </Slider>
        </VStack>
      </Box>
    </View>
  )
}
