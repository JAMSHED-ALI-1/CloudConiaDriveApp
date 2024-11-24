import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../utils/Colors';
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = ({ user, handleIconPress }) => {
  const userAvatar = user?.avatar ? { uri: user.avatar } : require('../assets/150.jpg');
  const navigation=useNavigation()
  const userName = user?.display_name || 'Guest';
  const language = useSelector((state) => state.language.language);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity style={styles.imgCircle}>
          <Image source={userAvatar} style={styles.userImage} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerNormalText}>{strings.WELCOME_BACK}</Text>
          <Text>{userName}</Text>
        </View>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleIconPress}>
          <Image source={require('../assets/ConiaSoft_AI_Icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.navigate('Notification')}>
          <Image source={require('../assets/noti.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10
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
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 7,
},
shadowOpacity: 0.43,
shadowRadius: 9.51,

elevation: 15,
borderWidth:0.5
  },
  userImage: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
    

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
});

export default HomeHeader;
