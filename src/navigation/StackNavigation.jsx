import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splesh from '../screens/auth/Splesh'
import MainSplesh from '../screens/auth/MainSplesh';
import Login from '../screens/auth/Login';
import UpdatePassword from '../screens/auth/UpdatePassword';
import Signup from '../screens/auth/Signup';
import BottomNavigation from './BottomNavigation';
import ImageViewer from '../screens/preview/ImageViewer';
import PdfView from '../screens/preview/PdfView';
import VideoPreview from '../screens/preview/VideoPreview';
import TextFilePreview from '../screens/preview/TextPreview';
import WordPreview from '../screens/preview/WordPreview';
import AudioPreview from '../screens/preview/AudioPreview';
import Test from '../../Test';
import EditProfile from '../screens/settings/EditProfile';
import ChoseLanguage from '../screens/settings/choselanguage';
import UpgradeScreen from '../utils/constant/UpgradeScreen';
import PptPreview from '../screens/preview/PptPreview';
import SpreadsheetPreview from '../screens/preview/SpreadsheetPreview';
import zipapkpreview from '../screens/preview/zipapkpreview';
import Zipapkpreview from '../screens/preview/zipapkpreview';
import Notification from '../screens/settings/Notification';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../redux/reducers/authSlice';
import PrivacyPolicy from '../screens/settings/PrivacyPolicy';
const Stack = createNativeStackNavigator();
const StackNavigation = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (user?.access_token) {
          // Add your token verification logic here
          // If you're using JWT tokens, you can decode and check expiration
          // For now, just logging the token
          // console.log('Current token:', user.access_token);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    checkAuth();
  }, [user]);
  return (
    <NavigationContainer>
    {/* <Stack.Navigator initialRouteName='Test'> */}
    <Stack.Navigator initialRouteName={isLoggedIn ? "BottomNavigation":"MainSplesh"}>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="Splesh" component={Splesh}  options={{headerShown:false}}/>
      <Stack.Screen name="MainSplesh" component={MainSplesh}  options={{headerShown:false}}/>
      <Stack.Screen name="Signup" component={Signup}  options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login}  options={{headerShown:false}}/>
      <Stack.Screen name="UpdatePassword" component={UpdatePassword}  options={{headerShown:false}}/>
      
      
      {/* Botttom tab start */}
      <Stack.Screen name="BottomNavigation" component={BottomNavigation}  options={{headerShown:false}} />



{/* Preview */}
<Stack.Screen name="ImageViewer" component={ImageViewer}  options={{headerShown:false}}/>
<Stack.Screen name="PdfView" component={PdfView}  options={{headerShown:false}}/>
<Stack.Screen name="VideoPreview" component={VideoPreview}  options={{headerShown:false}}/>
<Stack.Screen name="TextFilePreview" component={TextFilePreview}  options={{headerShown:false}}/>
<Stack.Screen name="WordPreview" component={WordPreview}  options={{headerShown:false}}/>
<Stack.Screen name="AudioPreview" component={AudioPreview}  options={{headerShown:false}}/>
<Stack.Screen name="PptPreview" component={PptPreview}  options={{headerShown:false}}/>
<Stack.Screen name="SpreadsheetPreview" component={SpreadsheetPreview}  options={{headerShown:false}}/>
<Stack.Screen name="Zipapkpreview" component={Zipapkpreview}  options={{headerShown:false}}/>


{/* Setting    Etc */}
<Stack.Screen name="EditProfile" component={EditProfile}  options={{headerShown:false}}/>
<Stack.Screen name="ChoseLanguage" component={ChoseLanguage}  options={{headerShown:false}}/>
      {/* Notification */}
      <Stack.Screen name="Notification" component={Notification}  options={{headerShown:false}}/>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}  options={{headerShown:false}}/>



{/* Testing Purpose */}
<Stack.Screen name="Test" component={Test}  options={{headerShown:false}}/>
<Stack.Screen name="UpgradeScreen" component={UpgradeScreen}  options={{headerShown:false}}/>

    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})