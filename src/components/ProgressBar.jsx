import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from '../utils/Colors';
import { baseURL } from '../utils/constant/settings';
import strings from '../helper/Language/LocalizedStrings';
import { clearState } from '../redux/reducers/authSlice';
import { persistor } from '../redux/store';

const ProgressBar = ({ width = 150, color = COLORS.orange, height = 10, label = '' }) => {
  const user = useSelector(state => state.auth.user);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const clearMemoryAndRedirect = async () => {
    try {
      // Clear Redux state and persistent storage
      dispatch(clearState());
      await persistor.purge();

      // Navigate to the login screen
      navigation.replace('Login');
    } catch (clearError) {
      console.error('Error clearing memory:', clearError.message);
    }
  };

  const fetchStorageData = async () => {
    try {
      const response = await axios.get(`${baseURL}/user/space-usage?timestamp=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      const data = response.data;
      const usedGB = (data.used / (1024 ** 3)).toFixed(2);
      const availableGB = Math.round(data.available / (1024 ** 3));
      const percentage = data.used / data.available;

      setStorageInfo({ used: usedGB, available: availableGB, percentage });
      setError(null); // Reset error state if the call succeeds
    } catch (error) {
      console.error('Error fetching storage data:', error.message);

      if (error.message === 'Network Error') {
        console.warn('Network error occurred. Clearing memory and redirecting to login screen.');
        clearMemoryAndRedirect();
      } else {
        setError('Failed to fetch storage data: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image source={require('../assets/ConiaSoft.png')} style={styles.logo} />
      </View>

      <View style={styles.statusContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b5998" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Progress.Bar
              progress={storageInfo.percentage}
              width={width}
              color={COLORS.orenge}
              height={20}
              borderRadius={10}
              borderWidth={1}
              unfilledColor="#f0f0f0"
            />
            <Text style={styles.label}>
              {`${storageInfo.used} GB of ${storageInfo.available} ${strings.GB_USED}`}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerLogo: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 70,
    resizeMode: 'contain',
  },
  statusContainer: {
    backgroundColor:COLORS.blue,
    height: 70,
    borderRadius: 10,
    width: 270,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProgressBar;
