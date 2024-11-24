import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to get user data from AsyncStorage
export const getUserData = async () => {
  try {
    // Retrieve user data
    const userData = await AsyncStorage.getItem('user');

    // Check if userData exists
    if (userData !== null) {
      // Parse the JSON string back to an object
      const user = JSON.parse(userData);
    //   console.log('User data:', user);
      return user; // Return the user object or handle it as needed
    } else {
      console.log('No user data found');
      return null; // Handle the case where there is no user data
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
};
