// import { StatusBar, StyleSheet, Text, View } from 'react-native';
// import React, { useEffect } from 'react';
// import StackNavigation from './src/navigation/StackNavigation';
// import FlashMessage from "react-native-flash-message";
// import { useSelector } from 'react-redux';
// import { APIServiceProvider } from './src/context/APIServiceContext';
// import { NavigationContainer } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { COLORS } from './src/utils/Colors';

// if (__DEV__) {
//   require("./ReactotronConfig");
// }

// const App = () => {

 
//   return (
//     <>
    
//     <NavigationContainer> 
//       <APIServiceProvider>
//         <View style={styles.container}>
//         <StatusBar barStyle="light-content"   backgroundColor={COLORS.blue}/>
//           <StackNavigation />
//           {/* <Mainstack/> */}
//           <FlashMessage position="top" />
//         </View>
//       </APIServiceProvider>
//     </NavigationContainer>
//     </>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });





import { StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import StackNavigation from './src/navigation/StackNavigation';
import FlashMessage from "react-native-flash-message";
import { APIServiceProvider } from './src/context/APIServiceContext';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';  
import { COLORS } from './src/utils/Colors';
import { UserProvider } from './src/redux/context/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { loadLanguageFromStorage, setLanguage } from './src/redux/reducers/languageSlice';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  require("./ReactotronConfig");
}

const App = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.language.language);
 const user = useSelector(state => state.auth.user);
  const locales = RNLocalize.getLocales();
  // console.log('📱 Language Code:', locales[0].languageCode); // e.g., 'hi', 'en'
  // console.log('🌍 Country Code:', locales[0].countryCode); 

  useEffect(() => {
    dispatch(loadLanguageFromStorage(user));
  }, []);
  
  useEffect(() => {
    console.log('[Redux] Current language in store:', language); // 👈 Log language from Redux
  }, [language]);
  // useEffect(() => {
  //   AsyncStorage.clear().then(() => {
  //     console.log('🧹 AsyncStorage cleared');
  //   });
  // }, []);
  
  return (
    <>

    <MenuProvider> 
      <NavigationContainer> 
        <APIServiceProvider>
          <UserProvider>

         
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.blue} />
            <StackNavigation />
            <FlashMessage position="top" />
          </View>
          </UserProvider>
        </APIServiceProvider>
      </NavigationContainer>
    </MenuProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
