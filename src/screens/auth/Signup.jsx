import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import InputBox from '../../components/InputBox';
import {COLORS} from '../../utils/Colors';
import axios from 'axios';
import {baseURL} from '../../utils/constant/settings';
import showMessageHandler from '../../utils/constant/ShowMessageHandler';
import CustomButton from '../../components/CustomButton';
import strings from '../../helper/Language/LocalizedStrings';
import CustomHeader from '../../components/CustomHeader';

// Validation Schemas for each step
const validationSchemas = [
  Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
  }),
  Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
  Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    zip: Yup.string().required('ZIP code is required'),
  }),
  Yup.object().shape({
    password: Yup.string()
      .min(6, 'Min 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  }),
];

const SignupStepperWithFormik = ({navigation}) => {
  const [step, setStep] = useState(0);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    password: '',
    confirmPassword: '',
  };

  // const handleSubmit = (values) => {
  //   console.log('Final Submitted Data:', values);
  //   // Submit logic goes here
  // };

  const handleSubmit = async (values, formikHelpers) => {
    try {
      const response = await axios.post(`${baseURL}/auth/register`, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        address: values.address,
        city: values.city,
        country: values.country,
        zipcode: values.zip,
        password: values.password,
        password_confirmation: values.confirmPassword,
        mobile: '',
        company: '',
        designation: '',
        device_name: 'iphone 12',
      });

      console.log('✅ Registration Success:', response.data);
      console.log(response.data.status);
      if (response.data.status === 'success') {
        // Show success toast or modal
        showMessageHandler('Registration Successful');
        formikHelpers.resetForm(); // Clear form
        setStep(0);
        navigation.navigate('Login');
        // navigation.navigate('BottomNavigation');
      }
      // Optionally navigate or show success modal
    } catch (error) {
      console.log(
        '❌ Registration Failed:',
        error.response?.data || error.message,
      );
      showMessageHandler(
        'Registration Failed',
        error.response?.data.message || 'An error occurred',
        'danger',
      );
      // Optionally show an error toast or modal
    }
  };

  const renderStep = props => {
    const {values, handleChange, errors, touched, handleBlur} = props;

    switch (step) {
      case 0:
        return (
          <>
            <InputBox
              style={styles.input}
              placeholder={strings.FirstName}
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              touched={touched.email}
              errors={errors.email}
              icon={require('../../assets/icons/profile.png')}
            />
            {touched.firstName && errors.firstName && (
              <Text style={styles.error}>{errors.firstName}</Text>
            )}

            <InputBox
              style={styles.input}
              placeholder={strings.LAST_NAME}
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              touched={touched.email}
              errors={errors.email}
              icon={require('../../assets/icons/profile.png')}
            />
            {touched.lastName && errors.lastName && (
              <Text style={styles.error}>{errors.lastName}</Text>
            )}
          </>
        );
      case 1:
        return (
          <>
            <InputBox
              style={styles.input}
              placeholder={strings.EMAIL}
              value={values.email}
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              icon={require('../../assets/icons/mail.png')}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
          </>
        );
      case 2:
        return (
          <>
            <InputBox
              style={styles.input}
              placeholder={strings.ADDRESS}
              value={values.address}
              onChangeText={handleChange('address')}
              onBlur={handleBlur('address')}
            />
            {touched.address && errors.address && (
              <Text style={styles.error}>{errors.address}</Text>
            )}

            <InputBox
              style={styles.input}
              placeholder={strings.CITY}
              value={values.city}
              onChangeText={handleChange('city')}
              onBlur={handleBlur('city')}
            />
            {touched.city && errors.city && (
              <Text style={styles.error}>{errors.city}</Text>
            )}

            <InputBox
              style={styles.input}
              placeholder={strings.COUNTRY}
              value={values.country}
              onChangeText={handleChange('country')}
              onBlur={handleBlur('country')}
            />
            {touched.country && errors.country && (
              <Text style={styles.error}>{errors.country}</Text>
            )}

            <InputBox
              style={styles.input}
              placeholder={strings.ZIPCODE}
              value={values.zip}
              keyboardType="numeric"
              onChangeText={handleChange('zip')}
              onBlur={handleBlur('zip')}
            />
            {touched.zip && errors.zip && (
              <Text style={styles.error}>{errors.zip}</Text>
            )}
          </>
        );
      case 3:
        return (
          <>
            <InputBox
              style={styles.input}
              placeholder={strings.PASSWORD}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              touched={touched.password}
              errors={errors.password}
              secure={true}
              icon={require('../../assets/Lock.png')}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <InputBox
              style={styles.input}
              placeholder={strings.CONFIRMPASSWORD}
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              secure={true}
              icon={require('../../assets/Lock.png')}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[step]}
      onSubmit={(values, props) => {
        if (step === 3) {
          handleSubmit(values, props);
        } else {
          setStep(step + 1);
        }
      }}>
      {props => (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.container}>
            <CustomHeader
              back={true}
              left={true}
              OnPress={() => navigation.goBack()}
              title={strings.CREATE}
            />
            {/* <Text style={styles.stepTitle}>{strings.CREATE}</Text> */}
            <Text style={styles.stepTitle}>
              {strings.STEP} {step + 1} of 4
            </Text>
            {renderStep(props)}

            <View style={styles.buttonContainer}>
              {step > 0 && (
                <TouchableOpacity
                  onPress={() => setStep(step - 1)}
                  style={styles.backButton}>
                  <Text style={styles.buttonText}>{strings.BACK}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={props.handleSubmit}
                style={styles.nextButton}>
                <Text style={styles.buttonText}>
                  {step === 3 ? strings.SIGNUP : strings.NEXT}
                </Text>
              </TouchableOpacity>
              {/* <CustomButton/> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: COLORS.blue,
    padding: 12,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.black,
  },
});

export default SignupStepperWithFormik;
