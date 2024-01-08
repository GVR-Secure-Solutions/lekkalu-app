import { ImageBackground, StyleSheet, TouchableOpacity, View, Image, TextInput, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router/src/useNavigation'
import { Button, Icon, Text, Tooltip } from 'native-base'
import CommoneSlider from '@/components/slider/slider'
import { AntDesign } from '@expo/vector-icons'
import CommonePopOver from '@/components/popover/popover'
import { calculateCagr } from '@/queries/cagr-calculator'

export default function cagrcalculator({ }) {
    const navigation = useNavigation()
    const [absoluteReturn, setabsoluteReturn] = useState(400)
    const [absoluteCAGR, setabsoluteCAGR] = useState(0.38)
    const [cagrPercentage, setcagrPercentage] = useState(37.97)
    const [Initialvalue, setInitialvalue] = useState(5000)
    const [FinalValue, setFinalValue] = useState(25000)
    const [Duration, setDuration] = useState(5)

    useEffect(() => {
       const data = calculateCagr(Initialvalue, FinalValue, Duration)
       console.log(data)
       setabsoluteCAGR(data?.absoluteCAGR != "Infinity" ? data?.absoluteCAGR:"--")
       setabsoluteReturn(data?.absoluteReturns != "Infinity" ? data?.absoluteReturns:"--")
       setcagrPercentage(data?.percentageCAGR != "Infinity" ? data?.percentageCAGR:"--")
    }, [Initialvalue, FinalValue, Duration])
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonBackground}>
                <Image source={require('../assets/backarrow.png')} resizeMode='contain' style={styles.backButton} />
            </TouchableOpacity>
            <View style={styles.subContainer}>
                <Text fontSize="sm" fontWeight="light" color={"white"}>Absolute returns</Text>
                <Text fontSize="2xl" fontWeight="bold" color={"white"}>{`${absoluteReturn} ₹`}</Text>
                <View style={styles.rowContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <Text fontSize="sm" fontWeight="light" color={"white"}>CAGR return</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={"white"}>{`${absoluteCAGR} ₹`}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text fontSize="sm" fontWeight="light" color={"white"}>CAGR percentage</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={"white"}>{`${cagrPercentage} %`}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.whiteContainer}>
                <View style={{ marginTop: 28 }}>
                    <View style={styles.sliderContainer}>
                        <Text fontSize="sm" fontWeight="light" color={"blue"} style={{ maxWidth: 200 }}>
                            Initial value (₹)
                        </Text>
                        <View style={styles.inputFeildStyle}>
                            <TextInput
                                value={`${Initialvalue}`}
                                onChangeText={(val) => val <= 10000000 ? setInitialvalue(val) : Keyboard.dismiss()}
                                keyboardType='numeric'
                            />
                            <CommonePopOver
                                Content='This is the starting value or principal investment amount. It represents the value of your investment or asset at the beginning of the investment period.'
                            />
                        </View>
                    </View>
                    <CommoneSlider
                        defaultValue={Initialvalue}
                        maxValue={10000000}
                        minValue={1000}
                        onChange={(val) => setInitialvalue(val)}
                    />
                </View>
                <View style={{ marginTop: 28 }}>
                    <View style={styles.sliderContainer}>
                        <Text fontSize="sm" fontWeight="light" color={"blue"} style={{ maxWidth: 200 }}>
                            Final Value Costs (₹)
                        </Text>
                        <View style={styles.inputFeildStyle}>
                            <TextInput
                                value={`${FinalValue}`}
                                onChangeText={(val) => val <= 10000000 ? setFinalValue(val) : Keyboard.dismiss()}
                                keyboardType='numeric'
                            />
                            <CommonePopOver
                                Content='This is the ending value or the current value of your investment after the specified duration. It represents the value of your investment at the end of the investment period.'
                            />
                        </View>
                    </View>
                    <CommoneSlider
                        defaultValue={FinalValue}
                        maxValue={10000000}
                        minValue={1000}
                        onChange={(val) => setFinalValue(val)}
                    />
                </View>
                <View style={{ marginTop: 28 }}>
                    <View style={styles.sliderContainer}>
                        <Text fontSize="sm" fontWeight="light" color={"blue"} style={{ maxWidth: 180 }}>
                            Duration of Investment (Years)
                        </Text>
                        <View style={styles.inputFeildStyle}>
                            <TextInput
                                value={`${Duration}`}
                                onChangeText={(val) => val <= 40 ? setDuration(val) : Keyboard.dismiss()}
                                keyboardType='numeric'
                            />
                            <CommonePopOver
                                Content='This is the length of time, in years, for which you held the investment. It represents the time period between the initial and final values.'
                            />
                        </View>
                    </View>
                    <CommoneSlider
                        defaultValue={Duration}
                        maxValue={40}
                        minValue={1}
                        onChange={(val) => setDuration(val)}
                    />
                </View>
                {/* <Text>{`CAGR Formula\nThe formula to calculate the Compound Annual Growth Rate (CAGR) is as follows:\nYour Absolute CAGR = (F/I)^(1 / D) - 1\nWhere:\n
F(Final Value): is the ending value or the current value of your investment after the specified duration.\nI(Initial Value): is the starting value or principal investment amount.\nD(Duration): is the length of time, in years, for which you held the investment.\nYour Absolute CAGR: is the Compound Annual Growth Rate calculated based on the initial value, final value, and costs.\nYour Absolute CAGR Percentage: represents the annualized growth rate of your investment expressed as a percentage.\nYour Absolute Returns: is the total return on your investment, accounting for the initial value and final value`}
                </Text> */}
                <View style={{paddingHorizontal:32,paddingTop:18}}>
                <Text fontWeight={'bold'}>{`CAGR Formula\n`}</Text>
                <Text fontWeight={'light'}>{`The formula to calculate the Compound Annual Growth Rate (CAGR) is as follows:\n`}</Text>
                <Text fontWeight={'bold'}>Your Absolute CAGR = <Text fontWeight={'light'}> (F/I)^(1 / D) - 1</Text></Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0058e2",
        paddingTop: 50
    },
    subContainer: {
        alignItems: 'center',
        marginTop: 12,
        marginHorizontal: 16,
    },
    sliderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        alignItems: 'center',
        marginBottom: 12,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "92%",
        alignItems: 'center',
        marginTop: 8
    },
    backButtonBackground: {
        backgroundColor: '#66c4fb54',
        marginHorizontal: 16,
        padding: 8,
        borderRadius: 100,
        width: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButton: {
        height: 14,
        width: 14,
        tintColor: 'white'
    },
    whiteContainer: {
        backgroundColor: "white",
        flex: 1,
        marginTop: 18,
        borderTopRightRadius: 22,
        borderTopLeftRadius: 22
    },
    inputFeildStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderColor: "gray",
        maxWidth: 140,
        width: 120
    },
})