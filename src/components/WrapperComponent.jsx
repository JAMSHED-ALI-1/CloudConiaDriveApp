import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../utils/Colors';

const WrapperComponent = ({ children }) => {
  const currentTheme = useSelector(state => state.theme.theme); // 'light' or 'dark'
  const isDark = currentTheme === 'dark';

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={[styles.container, { backgroundColor: isDark ? COLORS.black : COLORS.backgroundColor }]}>
      {children}
    </View>
    </SafeAreaView>
  );
};

export default WrapperComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
});
