import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform, KeyboardAvoidingView,Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { LoginInitialValue, loginValidtionSchema } from './utils';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../utils/Colors'; 
import CustomHeader from '../../components/CustomHeader';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/reducers/authSlice';
import { showMessage } from 'react-native-flash-message';
import strings from '../../helper/Language/LocalizedStrings';
import showMessageHandler from '../../utils/constant/ShowMessageHandler';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const Login = () => {
  const language = useSelector((state) => state.language.language);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
 const handleLogin = async (values) => {
    const { email, password } = values;
    setIsLoading(true);  // Show loader while login is happening
    try {
      const loginResponse = await dispatch(loginAsync({ email, password, token_name: 'android' })).unwrap();
      
      if (loginResponse) {
        // Show success flash message
        showMessageHandler("Login Successful", "You have logged in successfully.", "success");
        // Perform any further actions here, like navigating to the dashboard
        navigation.navigate('BottomNavigation');
        // navigation.navigate('Test');
      } else {
        // Show failure flash message
        showMessageHandler("Login Failed", "Invalid credentials or user not registered.", "danger");
      }
    } catch (error) {
      // Show error flash message
      showMessageHandler("Login Error", "An error occurred. Please try again.", "danger");
      console.error('Login failed with error:', error);
    } finally {
      setIsLoading(false);  // Hide loader after login attempt
    }
  };

  return (
    <Formik
    initialValues={LoginInitialValue}
    validationSchema={loginValidtionSchema}
    onSubmit={handleLogin}
  >
    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/ConiaSoft.png')} style={styles.headerlogo} />
          <Text style={styles.title}>{strings.WELCOME_BACK}</Text>
          <Text style={styles.subtitle}>{strings.Letsgettoknoweachotherinputpersonaldetailstobegin}</Text>
        </View>

        <View style={styles.formContainer}>
          <InputBox
             placeholder={strings.EnterYourEmail}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            touched={touched.email}
            errors={errors.email}
            icon={require('../../assets/icons/mail.png')}
          />

          <InputBox
            placeholder={strings.Enteryourpassword}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            touched={touched.password}
            errors={errors.password}
            secureTextEntry={true}
            secure={true}
            icon={require('../../assets/Lock.png')}
          />

          <CustomButton
            buttonTitle={strings.LOGIN}
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!isValid || isLoading}
          />

         {/* <TouchableOpacity style={styles.forgotPassword} 
         onPress={()=>navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.forgotPasswordText}>{strings.PrivacyPolicy}?</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles} 
         onPress={()=>navigation.navigate('Signup')}>
              <Text style={styles.signup}>{strings.NOTACCOUNT}?</Text>
            </TouchableOpacity>
        </View>
      </View>
    )}
  </Formik>
  )
};

export default Login;





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  header: {
    marginTop:Dimensions.get('screen').height*0.06,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal:20
  },
  formContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  passwordToggle: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  passwordToggleText: {
    fontSize: 14,
    color: '#6C63FF',
  },
  forgotPassword: {
    marginTop: 15,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#6C63FF',
    fontSize: 14,
    
  },
  headerlogo:{
    height:HEIGHT*.10,
    width:WIDTH*0.30,
    resizeMode:'contain'
  },
  signup: {
    marginTop: 18,
    alignSelf: 'center',
    color: '#6C63FF',
    fontSize: 14,
  },
});

