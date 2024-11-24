import { StyleSheet, Text, View ,SafeAreaView,Image} from 'react-native'
import React from 'react'
import { COLORS } from '../../utils/Colors'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const Splesh = () => {
  const navigation=useNavigation()
  return (
    <SafeAreaView style={styles.container}>
     <Image source={ require('../../assets/Splesh1.png')}
     style={{bottom:20}}/>
     <Text style={styles.text}>Keep life and work organized, all in one place.</Text>
     <View style={{marginTop:40,width:'90%',}}>
     <CustomButton buttonTitle='Login'
     onPress={()=>navigation.navigate('Login')}
     />
      {/* <Text style={{alignSelf:'center',fontSize:14,marginTop:30}}>If You Are Not  a User?
      </Text>
      <Text style={{alignSelf:'center',color:'#0071BC'}} onPress={()=>navigation.navigate('Signup')}>Sign Up to your account</Text> */}
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