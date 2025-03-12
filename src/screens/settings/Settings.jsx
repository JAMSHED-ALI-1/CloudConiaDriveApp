// 




import { StyleSheet, Text, TouchableOpacity, View ,Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../utils/Colors'
import CustomHeader from '../../components/CustomHeader'
import strings from '../../helper/Language/LocalizedStrings'
import Icon  from 'react-native-vector-icons/AntDesign'
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux'
import axios from 'axios'
import { baseURL } from '../../utils/constant/settings'
const data=[
  {
id:1,
text:strings.PrivacyPolicy,
 navigate:'WebViewComp',
url:'https://coniacloud.com/privacy-policy/'
},
{
  id:2,
  text:strings.TERMS_AND_CONDITIONS,
  navigate:'WebViewComp',
  url:'https://coniacloud.com/privacy-policy/'
  
  },
  // {
  //   id:3,
  //   text:strings.CHANGE_LANGUAGE,
  //   navigate:"ChoseLanguage",
  //   url:''
  //   },
]

const Settings = ({
  
  onPress=()=>{},
  text='',
  navigation
}) => {
  const user = useSelector(state => state.auth.user);

  return (
    <View style={{...styles.container}}>
      <CustomHeader title={strings.Settings} back={true} left={true} OnPress={()=>navigation.goBack()}/>
      <View>
        {data.map((item,index)=>{
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
        })}
      </View>
      
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:COLORS.backgroundColor,
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