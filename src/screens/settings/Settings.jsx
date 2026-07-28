// 




import { StyleSheet, Text, TouchableOpacity, View ,Image, SafeAreaView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../utils/Colors'
import CustomHeader from '../../components/CustomHeader'
import strings from '../../helper/Language/LocalizedStrings'
import Icon  from 'react-native-vector-icons/AntDesign'
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux'
import { checkVersion } from "react-native-check-version";
import axios from 'axios'
import { baseURL } from '../../utils/constant/settings'
import DeviceInfo from 'react-native-device-info'
const data=[
 
  {
    id:1,
    text:strings.CHANGE_LANGUAGE,
    navigate:"TermandConditions",
    url:'TermandConditions'
    },
]

const Settings = ({
  

  
  onPress=()=>{},
  text='',
  navigation
}) => {
  const user = useSelector(state => state.auth.user);
  const currentTheme = useSelector(state => state.theme.theme);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    // Listen for language change event if you have one
    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(prev => !prev);
    });

    return unsubscribe;
  }, [navigation]);

   const version = DeviceInfo.getVersion(); // e.g. "1.0.0"
    const buildNumber = DeviceInfo.getBuildNumber();
    // console.log(version, 'version');
    // console.log(buildNumber, 'buildNumber');

  return (
    <SafeAreaView style={{flex:1,backgroundColor:currentTheme==='dark'?COLORS.black:COLORS.backgroundColor}}>
    <View style={{...styles.container}}>
      <CustomHeader title={strings.Settings} back={true} left={true} OnPress={()=>navigation.goBack()}/>
      <View>
        {/* {data.map((item,index)=>{
          return(
            <TouchableOpacity key={item.id} 
            onPress={() => navigation.navigate(item.navigate, { url: item })}>        
            <Animatable.View  animation={'fadeInRightBig'} style={{...styles.card}}
            activeOpacity={0.7}>
             <Text>{item.text}</Text>
             <Icon name='right' size={20} color={'#696D70'}/>
            </Animatable.View>
            </TouchableOpacity>
          )
        })} */}
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('PrivacyPolicy')}>

      <Animatable.View  animation={'fadeInRightBig'} style={{...styles.card}}
            activeOpacity={0.7}>
             <Text style={{color:COLORS.black}}>{strings.PrivacyPolicy}</Text>
             <Icon name='right' size={20} color={'#696D70'}/>
            </Animatable.View>
      </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('TermandConditions')}>
            <Animatable.View  animation={'fadeInRightBig'} style={{...styles.card}}
            activeOpacity={0.7}>
             <Text style={{color:COLORS.black}}>{strings.RETURNPOLICY}</Text>
             <Icon name='right' size={20} color={'#696D70'}/>
            </Animatable.View>
            </TouchableOpacity>
      {/* //Copy Right Content */}
     

      


      <View style={{position:'absolute',bottom:100,alignSelf:'center',justifyContent:'center'}}>
        

        
      </View>
      
    </View>
    <View style={{paddingVertical:10,backgroundColor:COLORS.blue,position:'absolute',bottom:0,width:'100%'}}>
    <Text style={{fontSize:20,fontWeight:'800',alignSelf:"center",color:COLORS.white}}>{strings.App_Version} {version} </Text>

    <Text style={{fontSize:16,color:COLORS.white,padding:10}}>{strings.COPYRIGHTCONTENT}{strings.COPYRIGHTCONTENTADDRESS}</Text>
    </View>
  
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    flex:1,
    // backgroundColor:COLORS.backgroundColor,
    padding:15,
    
  },
  card:{
    backgroundColor:COLORS.white,
    padding:16,
    marginTop:10,
    borderRadius:10,
    flexDirection:'row',
justifyContent:'space-between'
  }
})