import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { LoginInitialValue, loginValidationSchema } from './utils';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../utils/Colors'; 
import CustomHeader from '../../components/CustomHeader';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../../redux/reducers/authSlice';
import { showMessage } from 'react-native-flash-message';


const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Helper function to display flash messages
  const showMessageHandler = (message, description, type) => {
    showMessage({
      message,
      description,
      type,
      icon: type, // icon can be 'success' or 'danger'
      duration: 3000,
      hideOnPress: true,
    });
  };

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginMainContainer}
      >
        <CustomHeader back={true} left={true} title={'Login'} />
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.Description}>Let’s get to know each other, input personal details to begin</Text>

        <Formik
          initialValues={LoginInitialValue}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isValid
          }) => (
            <View>
              <InputBox
                placeholder="Enter your email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                touched={touched.email}
                errors={errors.email}
                icon={require('../../assets/icons/mail.png')}
              />

              <InputBox
                placeholder="Enter your password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                touched={touched.password}
                errors={errors.password}
                secureTextEntry
                secure={true}
                icon={require('../../assets/Lock.png')}
              />
<TouchableOpacity 
onPress={()=>navigation.navigate('UpdatePassword')}
// onPress={()=>navigation.navigate('BottomNavigation')}
// onPress={()=>navigation.navigate('Test')}
>

              <Text style={styles.forget} >Forget Password?</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>navigation.navigate('PrivacyPolicy')}>
  
<Text style={styles.forget} >Term and conditions/Privacy Policy</Text>
</TouchableOpacity>

              <CustomButton 
                buttonTitle="Login"
                onPress={handleSubmit}
                isLoading={isLoading}  // Show loader when submitting
                disabled={!isValid || isLoading}  // Disable button while loading or form invalid
              />
            </View>
          )}
        </Formik>

        <View style={styles.signUpButton}>
          {/* <Text style={styles.text}>Don’t have an account? </Text> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.text, { color: COLORS.primeryBlue, fontSize: 16, marginTop: 5 }]}>
              Create a new account
            </Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,  // Ensuring background color
  },
  
  loginMainContainer: {
    flex: 1,
    paddingHorizontal: 20,  // Ensure padding horizontally
    paddingTop: Platform.select({
      ios: 20,   // Adjust padding for iOS
      android: 20  // Adjust padding for Android
    }),
    backgroundColor: COLORS.backgroundColor, 
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.boldText,
    textAlign: 'center',
    marginBottom: 10,
  },

  Description: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.boldText,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  forget: {
    color: COLORS.boldText,
    fontSize: 14,
    textAlign: 'right',
    marginVertical: 10,
    paddingRight: 10,
  },

  signUpButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },

  text: {
    color: COLORS.boldText,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
  },

  buttonContainer: {
    backgroundColor: COLORS.primery,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  inputContainer: {
    marginBottom: 20,
  },
});
