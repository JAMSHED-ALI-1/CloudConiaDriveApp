
import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native'; 
import { COLORS } from '../utils/Colors';


const SuccessAndFailModal = ({ visible, onClose ,url,message}) => {
    


    useEffect(() => {
        if (visible) {
          setTimeout(() => {
            onClose();
          }, 5000);
        }
      }
    ,[visible])



  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <View style={styles.modalContent}>
          <Text style={{...styles.textStyle}}>{message}</Text>
            {/* Lottie Animation */}
            <LottieView 
              source={url} // Ensure this path is correct
              autoPlay 
              loop 
              style={styles.lottie} // Add style for better visibility
            />
            
          
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Use your background color
    borderRadius: 10,
    alignItems: 'center',
    width: Platform.OS=='android'?"90%":'89%',  // Adjust width if necessary
    height: Platform.OS=='android'?'26%':'26%', // Adjust height if necessary
    overflow: 'hidden', // Ensures that the Lottie animation doesn't overflow outside the modal
    position: 'relative', // Enable positioning of child elements
  },
  lottie: {
    width: '100%', // Make Lottie cover the width
    height: '100%',
    resizeMode: 'contain', // Ensure Lottie covers the height
  },
  overlayText: {
    position: 'absolute', // Position text over the Lottie animation
    top: '20%', // Adjust based on your needs
    left: Platform.OS==="android"?'20%':"10%", // Adjust based on your needs
    color: 'white', // Change color based on your design
    fontSize: 16, // Adjust font size as needed
    zIndex: 1, // Ensure it appears above the Lottie animation
  },
  overlayImage: {
    position: 'absolute', // Position image over the Lottie animation
    top: '75%', // Adjust based on your needs
    left: '50%', // Center horizontally
    transform: [{ translateX: -20 }], // Adjust to center the image
    width: 40, // Adjust image size
    height: 40, // Adjust image size
    zIndex: 1, // Ensure it appears above the Lottie animation
  },
  textStyle:{
    fontSize:20,
    fontWeight:'bold',
    color:COLORS.white,
    marginTop:20
  }
});

export default SuccessAndFailModal

