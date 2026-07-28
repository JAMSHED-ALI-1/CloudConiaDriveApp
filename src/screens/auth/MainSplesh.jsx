import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; 
import { useSelector } from 'react-redux';

const MainSplesh = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setTimeout(() => {
        if (isLoggedIn) {
          navigation.replace('BottomNavigation'); // or 'Test' if testing
        } else {
          navigation.replace('Splesh');
        }
      }, 1000); // splash delay
    };

    checkLoginStatus();
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <View style={{ height: 120, width: 120 }}>
        <Image
          source={require('../../assets/ConiaSoft.png')}
          style={styles.logoImage}
        />
      </View>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default MainSplesh;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
  },
});
