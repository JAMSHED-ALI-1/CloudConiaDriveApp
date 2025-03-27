import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/Colors';
import LottieView from 'lottie-react-native';

const EmptyComponent = () => {
  return (
    <View style={styles.emptyContainer}>
        {/* <Icon name="folder-open-outline" size={50} color={COLORS.gray} /> */}
        <Text style={styles.emptyText}>This folder is empty</Text>
      <LottieView
        source={require('../assets/data/Empty.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    
    </View>
  );
};

export default EmptyComponent;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.black,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  lottie: {
    width: 300, // Adjusted size for better visibility
    height: 200,
    color: COLORS.gray,
  },
});
