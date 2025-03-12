import { StyleSheet, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const SubscriptionAnimation = () => {
  return (
    <View style={styles.container}>
       <LottieView 
          source={require('../assets/data/subscription.json')} // Ensure this path is correct
          autoPlay 
          loop 
          style={styles.lottie} 
        />
    </View>
  )
}

export default SubscriptionAnimation

const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 300,  
        height: 300,
    },
});
