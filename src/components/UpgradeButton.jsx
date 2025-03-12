import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/Colors'
import strings from '../helper/Language/LocalizedStrings'
import { useNavigation } from '@react-navigation/native'

const UpgradeButton = ({
    stylebtn={},
    onPress,

}) => {
    const navigation=useNavigation()
  return (
    <TouchableOpacity
   style={{...styles.btnContainer}}
   activeOpacity={0.7}
   onPress={()=>navigation.navigate('Pricelist')}
   >
    <View>

    <Text style={{...styles.btnText}}>{strings.NEED_MORE}</Text>
    <Text style={{...styles.btnText}}>{strings.STORAGECAPACITY}</Text>
    </View>
    <Text style={{...styles.btnText}}>{strings.UPGGRADE}</Text>


   </TouchableOpacity>
  )
}

export default UpgradeButton

const styles = StyleSheet.create({
    btnContainer:{
        backgroundColor:COLORS.blue,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between',
    padding:13,
    paddingVertical:20,
    alignItems:'center'
    },
    btnText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16
      },
})