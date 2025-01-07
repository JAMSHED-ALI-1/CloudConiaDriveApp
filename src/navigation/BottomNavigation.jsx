import { StyleSheet, Text, Image, View, BackHandler, Alert, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import strings from '../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import Home from '../screens/Deshboard/Home';
import MyDrive from '../screens/Deshboard/MyDrive';
import Shared from '../screens/Deshboard/Shared';
import Trash from '../screens/Deshboard/Trash';
import Stared from '../screens/Deshboard/Stared';
import Userprofile from '../screens/Deshboard/Userprofile';
import { COLORS } from '../utils/Colors';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ navigation }) => {
  const language = useSelector((state) => state.language.language);
useEffect(() => {
    const handleBackButton = () => {
      // Get the current route name from navigation state
      const currentRoute = navigation.getState().routes[navigation.getState().index];
      
      if (currentRoute.name === 'Home') {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back button behavior
      } else {
        // If not on home screen, navigate to home
        navigation.navigate('Home');
        return true; // Prevent default back button behavior
      }
    };

    // Adding the back button listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Cleanup the listener when component unmounts
    return () => {
      backHandler.remove();
    };
  }, [navigation]); 

  return (
    <Tab.Navigator
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.blue,
          height: Platform.OS === 'android' ? 70 : 100,
          paddingHorizontal: Platform.OS === 'android' ? 12 : 15,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;
          let iconSize = 20;

          switch (route.name) {
            case 'Home':
              iconName = require('../assets/icons/Dashboard.png');
              label = strings.HOME;
              iconSize = 20;
              break;
            case 'My Drive':
              iconName = require('../assets/MyDrive.png');
              label = strings.MyFiles;
              iconSize = 20;
              break;
            case 'Shared':
              iconName = require('../assets/icons/Users.png');
              label = strings.Shared;
              iconSize = 20;
              break;
            case 'Settings':
              iconName = require('../assets/icons/setting.png');
              label = strings.DELETEFILE;
              break;
            case 'User':
              iconName = require('../assets/icons/user.png');
              label = 'User';
              break;
            case 'Trash':
              iconName = require('../assets/icons/trash.png');
              label = strings.DELETEFILE;
              break;
            case 'Stared':
              iconName = require('../assets/icons/Starred.png');
              label = strings.STARED_FILES;
              break;
            default:
              break;
          }

          return (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Image
                style={{
                  width: iconSize,
                  height: iconSize,
                  tintColor: focused ? '#007bff' : '#F1F4FE',
                  resizeMode: 'contain',
                }}
                source={iconName}
              />
              {focused && <Text style={styles.label}>{label}</Text>}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="My Drive" component={MyDrive} />
      <Tab.Screen name="Shared" component={Shared} />
      <Tab.Screen name="Trash" component={Trash} />
      <Tab.Screen name="Stared" component={Stared} />
      <Tab.Screen name="User" component={Userprofile} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  tabItemFocused: {
    backgroundColor: '#F1F4FE',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  label: {
    marginLeft: 3,
    color: COLORS.blue,
    fontSize: 14,
  },
});