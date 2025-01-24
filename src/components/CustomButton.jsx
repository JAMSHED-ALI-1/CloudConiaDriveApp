import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import { COLORS } from '../utils/Colors';

const CustomButton = ({
  buttonTitle,
  onPress,
  isLoading, // Pass isLoading as a prop
  disabled,  // Keep the disabled prop
  backgroundColor,
}) => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={onPress} disabled={disabled || isLoading} >
        <View style={[styles.mainContainer, disabled && styles.disabledContainer]}>
          {/* Show ActivityIndicator when loading, otherwise show the button title */}
          {isLoading ? (
            <ActivityIndicator size='small' color={COLORS.white} />
          ) : (
            <Text style={styles.buttonStyle}>{buttonTitle}</Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: COLORS.BUTTON,
    borderRadius: Platform.select({
      ios: 30,
      android: 30,
    }),
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  disabledContainer: {
    backgroundColor: COLORS.BUTTON, // You can define this color in your COLORS
  },
});
