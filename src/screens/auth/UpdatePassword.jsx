import { StyleSheet, Text, View, ScrollView, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { updatepasswordValidtionSchema } from '../auth/utils';
import { baseURL } from '../../constant/settings';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import { makeApiCall } from '../../helper/apiHelper';
import { showMessage } from 'react-native-flash-message';
import { setLanguage } from '../../redux/reducers/languageSlice'; 
import strings from '../../helper/Language/LocalizedStrings';
import { COLORS } from '../../utils/Colors';
import { getUserData } from '../../utils/constant/GetUser';

const UpdatePassword = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [profileInitialValue, setProfileInitialValue] = useState({
    current_password:  '',
    new_password:  '',
    new_password_confirmation:  '',
  });

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const { user } = useSelector((state) => state.auth);
  const [err, setErr] = useState({});
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserData();
      if (user) {
        // console.log('Retrieved user:', user?.access_token);
      }
    };

    fetchUserData();
  }, []); 

  const showMessageHandler = (message, description, type) => {
    showMessage({
      message,
      description,
      type,
      icon: type, 
      duration: 3000,
      hideOnPress: true,
    });
  };

  const handleUpdate = async (values) => {
    try {
      if (customValidate(values) === 0) {
        const token = await makeApiCall('api/v1/users/me/password/change', user?.access_token, 'post', values);
        setIsLoading(true); 
        showMessageHandler("Success", "Password updated successfully", "success");
      }
    } catch (error) {
      console.log(error);
      showMessageHandler("Error", error.message || "An error occurred", "danger");
    }
    finally {
      setIsLoading(false);  // Hide loader after login attempt
    }
  };

  const handleChanges = (name, value) => {
    setProfileInitialValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const customValidate = (values) => {
    const errors = {};
    
    if (!values.current_password) {
      errors.current_password = 'Current password is required';
    } 
  
    if (!values.new_password) {
      errors.new_password = 'New password is required';
    } else if (values.new_password.length < 6) {
      errors.new_password = 'New password is too short!';
    } else if (values.new_password.length > 50) {
      errors.new_password = 'New password is too long!';
    }
  
    if (!values.new_password_confirmation) {
      errors.new_password_confirmation = 'Confirm Password is required';
    } else if (values.new_password_confirmation !== values.new_password) {
      errors.new_password_confirmation = 'Confirm Password does not match.';
    }
  
    setErr(errors);
    return Object.keys(errors).length;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginMainContainer}
      >
        <CustomHeader 
          back={true} 
          OnPress={() => navigation.goBack()} 
          left={true}  
          title={'Update Password'} 
        />
        <View style={styles.inputContainer}>
          <Formik
            enableReinitialize
            initialValues={profileInitialValue}
            validationSchema={updatepasswordValidtionSchema}
            onSubmit={handleUpdate}
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
              <View style={{ marginTop: 50 }}>
                <InputBox
                  placeholder="Current Password"
                  onChangeText={(e) => handleChanges('current_password', e)}
                  onBlur={handleBlur('current_password')}
                  value={values.current_password}
                  touched={touched.current_password}
                  errors={errors.current_password || err.current_password}
                />
                <InputBox
                  placeholder="New Password"
                  onChangeText={(e) => handleChanges('new_password', e)}
                  onBlur={handleBlur('new_password')}
                  value={values.new_password}
                  touched={touched.new_password}
                  errors={errors.new_password || err.new_password}
                />
                <InputBox
                  placeholder="Confirm Password"
                  onChangeText={(e) => handleChanges('new_password_confirmation', e)}
                  onBlur={handleBlur('new_password_confirmation')}
                  value={values.new_password_confirmation}
                  touched={touched.new_password_confirmation}
                  errors={errors.new_password_confirmation || err.new_password_confirmation}
                />
                <CustomButton 
                  buttonTitle={strings.UPDATE_PASSWORD} 
                  onPress={handleSubmit} 
                  isLoading={isLoading} 
                  disabled={!isValid || Object.keys(err).length > 0} 
                />
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor, 
    padding: Platform.select({
      ios: 0,   
      android: 20  
    }),
  },
  
  loginMainContainer: {
    flex: 1,
    paddingHorizontal: 20,  
    paddingTop: Platform.select({
      ios: 0,   
      android: 20  
    }),
    // paddingBottom: Platform.OS === 'ios' ? 40 : 0,  
    backgroundColor: COLORS.backgroundColor, 
  },
  
  inputContainer: {
   // marginBottom: 20, // Add some spacing for the input container
  },
});
