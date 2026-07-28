// helpers/logoutHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';
// adjust path as needed
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import {logoutAsync} from '../redux/reducers/authSlice';
import {persistor} from '../redux/store';
import strings from './Language/LocalizedStrings';

export const handleLogout = async (dispatch, navigation) => {
  try {
    // Show logging out message
    showMessageHandler('Logging out...');

    // Clear AsyncStorage 
    persistor.purge().then(() => {
      console.log('Persisted store purged');
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    });

    // Reset navigation stack and navigate to login screen

    showMessageHandler(strings.Successfullyloggedout);
  } catch (error) {
    console.error('Logout Error:', error);
    showMessageHandler('Logout failed. Please try again.');
  }
};
