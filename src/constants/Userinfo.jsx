import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import { makeApiCall } from '../helper/apiHelper';
import { COLORS } from '../utils/Colors';
import axios from 'axios';
import { baseURL } from '../utils/constant/settings';

const ProgressBar = ({ width = 150, color = COLORS.orenge, height = 10, label = '' }) => {
  const user = useSelector(state => state.auth.user);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStorageData = async () => {
    console.log('first')
    try {
      console.log('Fetching storage data...');
      // const response = await makeApiCall(`/api/v1/user/space-usage?timestamp=${Date.now()}`, user.access_token, 'get');
      const response= await axios.get(`${baseURL}/user/space-usage?timestamp=${new Date().getTime()}`,{
        headers:{Authorization:`Bearer ${user.access_token}`}
      })
      console.log('API Response:', response.data);
      const data = response.data;
      const usedGB = (data.used / (1024 ** 3)).toFixed(2);
      const availableGB = Math.round(data.available / (1024 ** 3));
      const percentage = data.used / data.available;
      setStorageInfo({ used: usedGB, available: availableGB, percentage });
      setError(null);
    } catch (error) {
      console.error('Error fetching storage data:', error.message);
      setError('Failed to fetch storage data: ' + error.message);
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
        <Image source={require('../assets/AppLogo.png')} style={styles.logo} />
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
              color={color}
              height={20}
              borderRadius={10}
              borderWidth={1}
              unfilledColor="#f0f0f0"
            />
            <Text style={styles.label}>
              {`${storageInfo.used} GB of ${storageInfo.available} GB used`}
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
    width: 100,
    height: 90,
    resizeMode: 'contain',
  },
  statusContainer: {
    backgroundColor: '#0071BC',
    height: 90,
    borderRadius: 10,
    width: 250,
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