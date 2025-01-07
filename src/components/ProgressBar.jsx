import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { CommonActions, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from '../utils/Colors';
import { baseURL } from '../utils/constant/settings';
import strings from '../helper/Language/LocalizedStrings';

const ProgressBar = ({ width = 150, color = COLORS.orenge, height = 10, label = '' }) => {
  const user = useSelector(state => state.auth.user);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const language = useSelector((state) => state.language.language);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fetchStorageData = async () => {
    try {
      // console.log('Fetching storage data...');
      const response = await axios.get(`${baseURL}/user/space-usage?timestamp=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${user.access_token}` },
      });

      // console.log('API Response:', response.data);

      const data = response.data;
      const usedGB = (data.used / (1024 ** 3)).toFixed(2);
      const availableGB = Math.round(data.available / (1024 ** 3));
      const percentage = data.used / data.available;
      setStorageInfo({ used: usedGB, available: availableGB, percentage });
      setError(null);

    } catch (error) {
      if (error.response?.status === 403 && error.message==='Netwok error') {
        console.warn('Unauthorized: Navigating to login screen');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );

      } else {
        console.error('Error fetching storage data:', error.message);
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
     

      <View style={styles.statusContainer}>
      <View style={styles.containerLogo}>
        <Image source={require('../assets/ConiaSoft.png')} style={styles.logo} />
      </View>
        {loading ? (
          <ActivityIndicator size="large" color="#3b5998" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
          <View>

          <Text style={{...styles.label,alignSelf:'center',bottom:6}}>
             {strings.storage}
            </Text>
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
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // marginVertical: 10,
    flexDirection:'row'
  },
  label: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color:COLORS.black
  },
  containerLogo: {
    // alignItems: 'center',
    height:80,
    width:70
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',

  },
  statusContainer: {
    backgroundColor: COLORS.white,
    height: 100,
    borderRadius: 10,
    width: '100%',
padding:20,
    alignItems: 'center',
  
    justifyContent:'space-between',
    paddingVertical: 15,
    gap:30,
    flexDirection:'row',
    marginTop:15,
    shadowColor: COLORS.blue,
shadowOffset: {
	width: 0,
	height: 4,
},
shadowOpacity: 0.32,
shadowRadius: 5.46,

elevation: 9,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProgressBar;
