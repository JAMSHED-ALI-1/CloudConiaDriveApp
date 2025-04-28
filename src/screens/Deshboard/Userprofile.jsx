import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Alert,ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useCallback,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import { persistor } from '../../redux/store';
import { logoutAsync,clearState, logout } from '../../redux/reducers/authSlice';
import { COLORS } from '../../utils/Colors';
import CustomHeader from '../../components/CustomHeader';
import strings from '../../helper/Language/LocalizedStrings';
import { baseURL } from '../../utils/constant/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign'
import * as Animatable from 'react-native-animatable';
import UpgradeButton from '../../components/UpgradeButton';
import LanguageChangeModal from '../../Modaals/LanguageChangeModal';
const Userprofile = ({ width = 320, color = COLORS.orenge, height = 10, label = '' }) => {
  const [isVisible,setVisible]=useState(false)

  // console.log(userAvatar,'User Avatar')
  const language = useSelector((state) => state.language.language);
  const [storageInfo, setStorageInfo] = useState({ 
    used: 0, 
    available: 0, 
    percentage: 0 
  });
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // console.log(user.avatar,'User Avatar')
  const userAvatar = user?.avatar.includes('www.gravatar.com') ? { uri: user.avatar }:{uri:`https://drive.coniacloud.com/${user?.avatar}`} ;
  // console.log(userAvatar,'User Avatar')
  // const userAvatar = user?.avatar.includes('www.gravatar.com') ? { uri: user.avatar }:{uri:`https://drive.coniacloud.com/${user?.avatar}`} ;
  const screenWidth = Dimensions.get('window').width;
  const progressBarWidth = screenWidth * 0.85;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchStorageData = useCallback(async () => {
    if (!user?.access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/user/space-usage?timestamp=${new Date().getTime()}`,
        {
          headers: { Authorization: `Bearer ${user.access_token}` },
          timeout: 10000
        }
      );

      const data = response.data;
      const usedGB = (data.used / (1024 ** 3)).toFixed(2);
      const availableGB = Math.round(data.available / (1024 ** 3));
      const percentage = Math.min(data.used / data.available, 1);
      
      setStorageInfo({ used: usedGB, available: availableGB, percentage });
      if(response.status===403){
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error) {
      console.error('Storage fetch error:', error);
      
    } finally {
      setLoading(false);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user) {
      fetchStorageData();
    }
  }, [fetchStorageData, user]);



  const logoutHandler = async () => {
    setLoggingOut(true);
    try {
      // 1. Dispatch logout actions first
      // dispatch(logout());
      // dispatch(logoutAsync());
      // dispatch(clearState());
  
      // 2. Clear AsyncStorage
      await AsyncStorage.removeItem('user');
  
      // 3. Purge persisted store
      // await persistor.purge();
  
      // 4. Reset navigation
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Logout Failed', 'Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };
  
 
  const LoadingView = () => (
    <View style={styles.container}>
      {/* <CustomHeader back={false} left={true} title={strings.User} /> */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Logging out...</Text>
      </View>
    </View>
  );

  const ProfileSection = () => {
    if (!user) return null;

    return (
      <View style={styles.profileContainer}>

   
      <View style={{
            flexDirection: 'row',
     alignItems: 'center',
     gap: 20,
    
    
      }}>
        <View style={{width:70,height:70,borderRadius:50,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.black,alignItems:'center',justifyContent:'center'}}> 

        <Image 
          source={userAvatar}
          style={styles.avatar}
            // uri: userAvatar,
            
            // headers: { Authorization: `Bearer ${user.access_token}` } 
          // } 
          // style={styles.avatar}
          // defaultSource={require('../../assets/notfound.png')}
        />
        </View>
        <View>
          <Text style={styles.heading}>
            {user.display_name || 'User'}
          </Text>
          <Text style={styles.email}>
            {user.email}
          </Text>
        </View>
        
      </View>

      <View style={styles.storageSection}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <>
            <Progress.Bar
              progress={storageInfo.percentage}
              width={progressBarWidth}
              color={color}
              height={10}
              borderRadius={10}
              borderWidth={1}
              unfilledColor="#f0f0f0"
            />
              <Text style={styles.storageText}>
              {storageInfo.used} GB of {storageInfo.available} {strings.GB_USED}
            </Text>    
          </>
        )}
          </View>
      </View>
    );
  };

  // const navigationData = [
  //   { id: 1, ImagePath: require('../../assets/icon/fi_user-check.png'), text: strings.ACCOUNT_INFORMATION, navigate: "EditProfile" },
  //   { id: 2, ImagePath: require('../../assets/icon/Lock.png'), text: strings.CHANGE_PASSWORD, navigate: "UpdatePassword" },
  //     { id: 3, ImagePath: require('../../assets/icon/smallFile.png'), text: strings.CHANGE_LANGUAGE, setVisible(true)},
  //     // { id: 4, ImagePath: require('../../assets/setting.png'), text: strings.Settings, navigate: "Settings" },
  // ];
  const navigationData = [
    {
      id: 1,
      ImagePath: require('../../assets/icon/fi_user-check.png'),
      text: strings.ACCOUNT_INFORMATION,
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      id: 2,
      ImagePath: require('../../assets/icon/Lock.png'),
      text: strings.CHANGE_PASSWORD,
      onPress: () => navigation.navigate("UpdatePassword"),
    },
    {
      id: 3,
      ImagePath: require('../../assets/icons/Settings.png'),
      text: strings.Settings,
      onPress: () => navigation.navigate("Settings"),
    },
    {
      id: 4,
      ImagePath: require('../../assets/icon/smallFile.png'),
      text: strings.CHANGE_LANGUAGE,
      onPress: () => setVisible(true), // Only called on press
    },
  ];
  

  const renderNavigationItem = ({ id, ImagePath, text, onPress }) => (
    <TouchableOpacity
      key={id}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={loggingOut}
    >
   <Animatable.View  animation={'fadeInRightBig'} View style={styles.navigationItem}>



<View style={{flexDirection:'row',alignItems:'center',gap:10}}>

      <Image source={ImagePath} style={styles.navigationIcon} tintColor={'#696D70'}/>
      <Text style={styles.navigationText}>{text}</Text>
</View>
     
     
      <Icon name='right' size={20} color={'#696D70'}/>
      </Animatable.View>
    </TouchableOpacity>
  );



  if (loggingOut) return <LoadingView />;

  return (
   <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}> 
     <View style={styles.container}>
      <CustomHeader title={strings.PROFILE} />
      <ScrollView showsVerticalScrollIndicator={false}>

      
      <ProfileSection />

     
  {/* <TouchableOpacity style={styles.upgrade}
            // onPress={()=>navigation.navigate('UpgradeScreen')}>
            onPress={()=>navigation.navigate('Pricelist')}>
              <Text style={{padding:'5%',fontSize:16,color:COLORS.white}}>
                {strings.UpgradeStorageSpace}
              </Text>
            </TouchableOpacity> */}
<View style={styles.navigationContainer}>
        {navigationData.map(renderNavigationItem)}
      </View>
    {/* upgrade */}
   {/* <TouchableOpacity
   style={{...styles.more}}
   activeOpacity={0.7}
   onPress={()=>navigation.navigate('Pricelist')}>
    <View>

    <Text style={{...styles.btnText}}>{strings.NEED_MORE}</Text>
    <Text style={{...styles.btnText}}>{strings.STORAGECAPACITY}</Text>
    </View>
    <Text style={{...styles.btnText}}>{strings.UPGGRADE}</Text>


   </TouchableOpacity> */}
   {/* UpGrade Button -------- */}
   <UpgradeButton/>

      <TouchableOpacity 
        style={[styles.btn, loggingOut && styles.btnDisabled]}
        // onPress={()=>setVisible(true)}
        onPress={logoutHandler}
        disabled={loggingOut}
      >
        <Text style={styles.btnText}>
          {loggingOut ? 'Logging out...' : strings.LOGOUT}
        </Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
   
      <LanguageChangeModal isvisible={isVisible} onclose={()=>setVisible(false)}/>
   </SafeAreaView>
  );
};

export default Userprofile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.noermalText
  },
  btn: {
    height: 50,
    width: '100%',
    backgroundColor:COLORS.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20
  },
  btnDisabled: {
    backgroundColor: '#ffcccc',
    opacity: 0.7
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16
  },
  profileContainer: {
 
    gap: 25,
    marginTop: 10,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
  
  },
  avatar: {
    width: '90%',
    height: '90%',
    borderRadius:30,
    resizeMode:'contain'
    // borderRadius: 30,
    // backgroundColor: COLORS.white,
  
   
  
  },
  heading: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.noermalText,
    marginBottom: 4
  },
  email: {
    fontSize: 14,
    color: COLORS.secondaryText
  },
  storageSection: {
    marginTop: 5,
  },
  loader: {
    marginVertical: 20,
  },
  storageText: {
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 27,
    marginTop: 10,
    color: COLORS.noermalText,
  },
  upgradeContainer: {
    width: '100%',
    backgroundColor: COLORS.primeryBlue,
    height: 50,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  navigationContainer: {
    marginTop:20
    // width:'100%'
    // marginTop: 10,
    // backgroundColor: COLORS.white,
    // borderRadius: 10,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // paddingHorizontal:10
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor: COLORS.white,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal:10,
    padding:20
  },
  navigationIcon: {
    height: 25,
    width: 25,
    marginRight: 15,
    resizeMode: 'contain',
  },
  navigationText: {
    fontSize: 14,
    color: '#696D70',
    fontWeight: '400',
  },
  logoutButton: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutIcon: {
    height: 30,
    width: 30,
  },
  logoutText: {
    color: '#FF4E4E',
    fontWeight: '500',
    fontSize: 16,
  },
  upgrade:{
    width:'100%',backgroundColor:COLORS.blue,marginTop:20,borderRadius:15,alignItems:'center' ,shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  more:{
    backgroundColor:COLORS.blue,
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between',
    padding:13,
    paddingVertical:20,
    alignItems:'center'
  }
});