// AnimationModal.js
import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, Platform } from 'react-native';
import LottieView from 'lottie-react-native'; // Ensure this is correctly imported
import { COLORS } from '../utils/Colors'; // Adjust the path as necessary

const AnimationModal = ({ visible, onClose }) => {
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
            {/* Lottie Animation */}
            <LottieView 
              source={require('../assets/Animation .json')} // Ensure this path is correct
              autoPlay 
              loop 
              style={styles.lottie} // Add style for better visibility
            />
            {/* Text on top of the Lottie animation */}
            <Text style={styles.overlayText}>ConiaSoft Artificial Intelligence -CAI</Text>
            <Text style={[styles.overlayText,{fontSize:11, top: '31%',textAlign:'center',left:'0%',paddingHorizontal:10}]}>Artificial Intelligence -powered featured by ConiaSoft are On The Way Experience The Feature of Productivity with our Advance CAI features</Text>
            <Text style={[styles.overlayText,{fontSize:10, top:Platform.OS==='android' ?'45%':"53%",textAlign:'center',left: Platform.OS==="android"?"30%":"20%"}]}>Send Your request to AI@ConiaSoft.com</Text>
            <Text style={[styles.overlayText,{fontSize:10, top:Platform.OS==='android' ?'51%':"60%",textAlign:'center',alignSelf:'center',left: Platform.OS==="android"?"30%":"20%"}]}>and stay tuned for Revolutionary Update</Text>
            {/* Image on top of the Lottie animation */}
            <Image 
              source={require('../assets/ConiaSoft_AI_Icon.png')}
              style={styles.overlayImage} // Style for the image
            />
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AnimationModal;

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
  //  height:'60%'
  },
  modalContent: {
    // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Use your background color
    borderRadius: 10,
    alignItems: 'center',
    width: Platform.OS=='android'?"90%":'89%',  // Adjust width if necessary
    height: Platform.OS=='android'?'28%':'28%', // Adjust height if necessary
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
});
