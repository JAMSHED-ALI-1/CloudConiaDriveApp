// helpers/logoutHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';
// adjust path as needed
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import { logoutAsync } from '../redux/reducers/authSlice';


export const handleLogout = async (dispatch, navigation) => {
  try {
    // Show logging out message
    showMessageHandler('Logging out...');
  
    // Clear AsyncStorage (if you are storing more data than just 'user', clear all if necessary)
    await AsyncStorage.removeItem('user'); // Adjust this key if necessary
    await AsyncStorage.clear();  // Optional: Clear all AsyncStorage keys
  
    // Dispatch logout action (to clear Redux state)
    await dispatch(logoutAsync());
  
    // Reset navigation stack and navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  
    showMessageHandler('Successfully logged out');
  } catch (error) {
    console.error('Logout Error:', error);
    showMessageHandler('Logout failed. Please try again.');
  }
};
