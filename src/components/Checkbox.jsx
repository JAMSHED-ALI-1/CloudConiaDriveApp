import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Checkbox = ({ checked, onChange, text }) => {
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checked]}
        onPress={onChange}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Checkbox;