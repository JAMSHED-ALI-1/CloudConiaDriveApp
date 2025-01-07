import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { profileValidtionSchema } from '../auth/utils'; // Assuming this is your validation schema
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import CustomHeader from '../../components/CustomHeader';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { makeApiCall } from '../../helper/apiHelper';
import { updateUserAsync } from '../../redux/reducers/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/Colors';
import strings from '../../helper/Language/LocalizedStrings';

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileInitialValue, setProfileInitialValue] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: '',
    designation: ''
  });

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const { user } = useSelector((state) => state.auth);
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    } else {
      setProfileInitialValue({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        company: user?.company || '',
        designation: user?.designation || ''
      });
    }
  }, [user, navigation]);

  const handleProfile = async (values) => {
    try {
      const updateUser = await dispatch(updateUserAsync(values)).unwrap();
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Profile updated successfully',
        button: 'Close'
      });
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Error',
        textBody: error.message,
        button: 'Close'
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor }}>
        <ScrollView style={styles.container}>
          <CustomHeader
            back={true}
            OnPress={() => navigation.goBack()}
            left={true}
            title={strings.ACCOUNT_SETTINGS}
          />
          <View style={styles.inputContainer}>
            <Formik
              enableReinitialize
              initialValues={profileInitialValue}
              validationSchema={profileValidtionSchema}
              onSubmit={handleProfile}
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
                <View style={{ marginTop: 20, width: '100%' }}>
                  {/* First Name */}
                  <Text style={styles.normaltext}>First Name</Text>
                  <InputBox
                    placeholder="First Name"
                    onChangeText={handleChange('first_name')}
                    onBlur={handleBlur('first_name')}
                    value={values.first_name}
                    touched={touched.first_name}
                    errors={errors.first_name}
                  />

                  {/* Last Name */}
                  <Text style={styles.normaltext}>Last Name</Text>
                  <InputBox
                    placeholder="Last Name"
                    onChangeText={handleChange('last_name')}
                    onBlur={handleBlur('last_name')}
                    value={values.last_name}
                    touched={touched.last_name}
                    errors={errors.last_name}
                     
                  />

                  {/* Email */}
                  <Text style={styles.normaltext}>Email</Text>
                  <InputBox
                    placeholder="Email"
                    value={values.email}
                    touched={touched.email}
                    editable={false}
                    errors={errors.email}
                  />

                  {/* Company */}
                  <Text style={styles.normaltext}>Company Name</Text>
                  <InputBox
                    placeholder="Company"
                    onChangeText={handleChange('company')}
                    onBlur={handleBlur('company')}
                    value={values.company}
                    touched={touched.company}
                    errors={errors.company}
                  />

                  {/* Designation */}
                  <Text style={styles.normaltext}>Designation</Text>
                  <InputBox
                    placeholder="Designation"
                    onChangeText={handleChange('designation')}
                    onBlur={handleBlur('designation')}
                    value={values.designation}
                    touched={touched.designation}
                    errors={errors.designation}
                  />

                  {/* Mobile Number */}
                  <Text style={styles.normaltext}>Mobile Number</Text>
                  <InputBox
                    placeholder="Mobile"
                    onChangeText={handleChange('mobile')}
                    onBlur={handleBlur('mobile')}
                    value={values.mobile}
                    touched={touched.mobile}
                    errors={errors.mobile}
                    keyboardType="phone-pad"
                  />

                  {/* Submit Button */}
                  <CustomButton
                    buttonTitle="Update"
                    onPress={handleSubmit}
                    disabled={!isValid || loading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: COLORS.bgcolor,
  },
  inputContainer: {
    alignItems: 'center',
  },
  normaltext: {
    fontSize: 14,
    color: COLORS.black,
    bottom: 5,
  }
});
