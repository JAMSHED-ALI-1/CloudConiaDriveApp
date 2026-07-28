import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/Colors';
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import TextCompo from './TextCompo';

const HomeHeader = ({ user, handleIconPress,handlecreateOpenModal }) => {
  const currentTheme=useSelector((state)=>state.theme.theme)
  console.log(currentTheme,'Current Theme')
  // console.log('Hederer',user)
  const userAvatar = user?.avatar.includes('www.gravatar.com') ? { uri: user.avatar }:{uri:`https://drive.coniacloud.com/${user?.avatar}`} ;
  const navigation=useNavigation()
  const userName = user?.display_name || 'Guest';
  const language = useSelector((state) => state.language.language);
  const [showmodal, setShowmodal] = useState(false);
  return (
    <View style={{...styles.headerContainer, backgroundColor: currentTheme === 'dark' ? COLORS.black : COLORS.white ,}}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity style={{...styles.imgCircle,shadowColor:currentTheme === 'dark' ? COLORS.white:COLORS.blue}}>
          <Image source={userAvatar} style={styles.userImage} resizeMethod='contain' />
        </TouchableOpacity>
        <View>
          {/* <Text style={styles.headerNormalText}>{strings.WELCOME_BACK}</Text> */}
          <TextCompo>{strings.WELCOME_BACK}</TextCompo>
          <TextCompo >{userName}</TextCompo>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlecreateOpenModal}>
          <Text style={{...styles.text,color:currentTheme === 'dark' ? COLORS.white : COLORS.black }}> +</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleIconPress}>
          <Image source={require('../assets/ConiaSoft_AI_Icon.png')} style={styles.icon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.navigate('Notification')}>
          <Image source={require('../assets/noti.png')} style={styles.icon} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor:COLORS.backgroundColor,
    borderBottomWidth:1,
    // marginTop:10,
    // backgroundColor:currentTheme==='dark'?COLORS.black:COLORS.white,
    // borderTopWidth:1,
    padding:10,
    // borderBottomColor:'pink',
    // borderBottomWidth:1
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imgCircle: {
    height: 50,
    width: 50,
    borderRadius: 25, // Ensure it's a circle
    backgroundColor: 'white',
    // shadowColor: COLORS.blue,
    alignItems:'center',
    justifyContent:'center',
shadowOffset: {
	width: 0,
	height: 7,
},
shadowOpacity: 0.43,
shadowRadius: 9.51,

elevation: 15,
borderWidth:0
  },
  userImage: {
    height: '90%',
    width: '90%',
    borderRadius: 50,
    resizeMode:'contain'
    

  },
  headerNormalText: {
    fontSize: 14,
    color: COLORS.noermalText,
    fontWeight:'800'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  iconButton: {


  
      
  },
  icon: {
    width: 28,
    height: 26,
    marginLeft: 18,
    resizeMode: 'contain',
  },
  text: {
    // color: '#111',
    color: COLORS.white,
    fontSize: 30,
    fontWeight:'800'
  },
});

export default HomeHeader;
