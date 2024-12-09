import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../redux/store'; // Import your Redux store
import { clearState } from '../redux/reducers/authSlice'; // Import the clearState action
import { useNavigation } from '@react-navigation/native';

const Tokenexpiredhelper = axios.create({
  baseURL: AppSettings.base_url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  
});
const navigation=useNavigation()
// Add a response interceptor
api.interceptors.response.use(
  async (response) => {
    // Pass through successful responses
    return response;
  },
  async (error) => {
    // Handle token expiration
    if (error.response?.status === 403 ) {
      console.error('Token expired or unauthorized. Logging out...');
   
      // Clear AsyncStorage
      

      // Dispatch Redux action to clear state
      store.dispatch(clearState());

      // Redirect to login (assumes you're using React Navigation)
      // This depends on your navigation setup
      navigation.navigate('Login'); // Replace with your navigation method
    }

    return Promise.reject(error);
  }
);

export default Tokenexpiredhelper;
