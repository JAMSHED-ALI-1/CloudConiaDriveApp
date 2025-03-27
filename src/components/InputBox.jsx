import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../utils/Colors';

const InputBox = ({
  placeholder,
  onBlur,
  onChangeText,
  value,
  touched,
  secureTextEntry,
  keyboardType,
  maxLength,
  errors,
  secure,
  icon, // Add icon prop to pass the icon image
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showEye, setShowEye] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEye = () => {
    setShowEye(!showEye);
  };

  // console.log("Keyboard Type:", keyboardType); // Log keyboardType to check if it's passed correctly

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputWrapper}>
        <View style={styles.placeholdericoncontainer}>
          {icon && <Image source={icon} style={styles.iconStyle} />}
          <TextInput
            style={styles.inputContainer}
            placeholder={placeholder}
            placeholderTextColor={COLORS.noermalText}
            onBlur={onBlur}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secure && !showEye} // Control password visibility
            keyboardType={keyboardType} // Ensure the keyboard type is passed correctly
            maxLength={maxLength}
          />
        </View>

        {secureTextEntry ? (
          <Icon
            name={showEye ? 'eye' : 'eye-slash'}
            size={20}
            style={[styles.iconStyle, { right: 15 }]}
            color={COLORS.faint}
            onPress={handleEye}
          />
        ) : null}
      </View>
      {errors && touched && <Text style={styles.errorStyle}>{errors}</Text>}
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
   backgroundColor:COLORS.white,
   shadowColor: COLORS.blue,
shadowOffset: {
	width: 0,
	height: 6,
},
shadowOpacity: 0.37,
shadowRadius: 7.49,

elevation: 12,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 15,
    color:COLORS.black,
   
  },
  errorStyle: {
    color: 'red',
    marginTop: 5,
    fontSize: 13,
  },
  placeholdericoncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
