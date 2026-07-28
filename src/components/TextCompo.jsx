import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../utils/Colors'; // Make sure to define your colors here

const TextCompo = ({ children, style, ...props }) => {
  const theme = useSelector((state) => state.theme.theme); // Get the current theme from Redux
  
  // Define dynamic text color based on theme
  const dynamicTextColor = theme === 'dark' ? COLORS.white : COLORS.black;

  return (
    <Text {...props} style={[style, { color: dynamicTextColor }]}>
      {children}
    </Text>
  );
};





const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});


export default TextCompo
