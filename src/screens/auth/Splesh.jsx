import { StyleSheet, Text, View ,SafeAreaView,Image} from 'react-native'
import React from 'react'
import { COLORS } from '../../utils/Colors'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import strings from '../../helper/Language/LocalizedStrings'
import { useSelector } from 'react-redux'

const Splesh = () => {
  const navigation=useNavigation()
  const language = useSelector((state) => state.language.language);
  return (
    <SafeAreaView style={styles.container}>
     <Image source={ require('../../assets/Splesh1.png')}
     style={{bottom:20}}/>
     <Text style={styles.text}>{strings.Keeplifeandworkorganizedallinoneplace}</Text>
     <View style={{marginTop:40,width:'90%',}}>
     <CustomButton buttonTitle={strings.LOGIN}
     onPress={()=>navigation.navigate('Login')}
     />
     
     </View>
    </SafeAreaView>
  )
}

export default Splesh

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:COLORS.backgroundColor,
        alignItems:'center',
justifyContent:'center',
bottom:40
    },
    text:{
        fontWeight:'700',
        fontSize:24,
        lineHeight:36,
        textAlign:'center',
        color:'#0071BC'
      }
})