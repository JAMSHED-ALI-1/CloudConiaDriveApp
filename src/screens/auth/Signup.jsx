
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import React, { useEffect } from 'react';
import { Formik } from 'formik';
import { LoginInitialValue, SignupInitialValue, SignupValidtionSchema, loginValidationSchema } from './utils';
import InputBox from '../../components/InputBox';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import { loginAsync } from '../../redux/reducers/authSlice';
import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';


const Signup = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isLoggedIn, loading, error, user } = useSelector((state) => state.auth);
    const handleSignup = () => {
        console.log("Signup");
    }


    return (
        <SafeAreaView style={styles.container}>

       
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.loginMainContainer}
      >
        <View style={styles.loginMainContainer}>
            <CustomHeader back={true} left={true} title={'Hey There!'}
                OnPress={() => navigation.goBack()} />
           
                <Text style={styles.text}>Let’s get to know each other, input personal details to begin</Text>
                <Formik
                    initialValues={SignupInitialValue}
                    validationSchema={SignupValidtionSchema}
                 onSubmit={handleSignup}
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
                        <View >
                            <InputBox
                                placeholder={'First Name'}
                                 onChangeText={handleChange('firstname')}
                                onBlur={handleBlur('firstname')}
                               
                                value={values.firstname}
                                icon={require('../../assets/icons/user.png')}
                                touched={touched.firstname}
                                errors={errors.firstname} />
                            <InputBox
                                placeholder={'Last Name'} 
                                onChangeText={handleChange('Lastname')}
                                onBlur={handleBlur('Lastname')}
                                value={values.Lastname}
                                touched={touched.Lastname}
                                icon={require('../../assets/icons/user.png')}
                                errors={errors.Lastname} />
                            <InputBox
                                placeholder={'Enter email Address'}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                touched={touched.email}
                                errors={errors.email}
                                icon={require('../../assets/icons/mail.png')}
                            />

                            <InputBox
                                placeholder={'Password'}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                touched={touched.password}
                                errors={errors.password}
                                secureTextEntry
                                secure={true}
                                icon={require('../../assets/Lock.png')}
                            />
                          
                            <View style={{marginTop:40}}>
                            <CustomButton buttonTitle={'Sign in'} disabled={!isValid || loading} onPress={handleSubmit}/>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
            <View style={styles.signUpButton}>
                <Text style={styles.text}>Already a User?  </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.text, { color: COLORS.blue, fontSize: 16, marginTop: 5 }]}>Log in to your account</Text>
                </TouchableOpacity>
            </View>
            {loading && (
                <View style={styles.loadingOverlay}>
                    <Text>Loading...</Text>
                </View>
            )}
       
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,  
    },
    
    loginMainContainer: {
      flex: 1,
      paddingHorizontal: 20,  
      paddingTop: Platform.select({
        ios: 20,   
        android: 20  
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
      paddingVertical:15
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