// // AnimationModal.js
// import React from 'react';
// import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, Platform } from 'react-native';
// import LottieView from 'lottie-react-native'; // Ensure this is correctly imported
// import { COLORS } from '../utils/Colors'; // Adjust the path as necessary

// const AnimationModal = ({ visible, onClose }) => {
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
   
//         <TouchableOpacity style={styles.overlay} onPress={onClose}>
//           <View style={styles.modalContent}>
//             {/* Lottie Animation */}
//             <LottieView 
//               source={require('../assets/Animation .json')} // Ensure this path is correct
//               autoPlay 
//               loop 
//               style={styles.lottie} // Add style for better visibility
//             />
//             {/* Text on top of the Lottie animation */}
//             <Text style={styles.overlayText}>ConiaSoft Artificial Intelligence -CAI</Text>
//             <Text style={[styles.overlayText,{fontSize:11, top: '31%',textAlign:'center',left:'0%',paddingHorizontal:10}]}>Artificial Intelligence -powered featured by ConiaSoft are On The Way Experience The Feature of Productivity with our Advance CAI features</Text>
//             <Text style={[styles.overlayText,{fontSize:10, top:Platform.OS==='android' ?'45%':"53%",textAlign:'center',left: Platform.OS==="android"?"30%":"20%"}]}>Send Your request to AI@ConiaSoft.com</Text>
//             <Text style={[styles.overlayText,{fontSize:10, top:Platform.OS==='android' ?'51%':"60%",textAlign:'center',alignSelf:'center',left: Platform.OS==="android"?"30%":"20%"}]}>and stay tuned for Revolutionary Update</Text>
//             {/* Image on top of the Lottie animation */}
//             {/* <Image 
//               source={require('../assets/ConiaSoft_AI_Icon.png')}
//               style={styles.overlayImage} // Style for the image
//             /> */}
//           </View>
//         </TouchableOpacity>
   
//     </Modal>
//   );
// };

// export default AnimationModal;

// const styles = StyleSheet.create({
  
//   overlay: {
//     flex: 1,
//     // height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     // width: '100%',
//   //  height:'60%'
//   },
//   modalContent: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   lottie: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//   }
// ,  
//   overlayText: {
//     position: 'absolute', // Position text over the Lottie animation
//     top: '20%', // Adjust based on your needs
//     left: Platform.OS==="android"?'20%':"10%", // Adjust based on your needs
//     color: 'white', // Change color based on your design
//     fontSize: 16, // Adjust font size as needed
//     zIndex: 1, // Ensure it appears above the Lottie animation
//   },
//   // overlayImage: {
//   //   position: 'absolute', // Position image over the Lottie animation
//   //   top: '75%', // Adjust based on your needs
//   //   left: '50%', // Center horizontally
//   //   transform: [{ translateX: -20 }], // Adjust to center the image
//   //   width: 40, // Adjust image size
//   //   height: 40, // Adjust image size
//   //   zIndex: 1, // Ensure it appears above the Lottie animation
//   // },
// });


import React from 'react';
import { Modal, View, Text, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const LottieModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true} // Full screen, no dimming overlay
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.container} onPress={onClose} activeOpacity={1}>
        {/* Lottie as background */}
        <LottieView
          source={require('../assets/Animation .json')}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject} // Makes it full-screen and behind everything
        />

        {/* Overlay Content */}
        <View style={styles.overlayContent} onPress={onClose}>
          <Text style={styles.title}>ConiaSoft Artificial Intelligence - CAI</Text>
          <Text style={styles.subtitle}>
          Artificial Intelligence -powered featured by ConiaSoft are On The Way Experience The Feature of Productivity with our Advance CAI features
          </Text>
          <Text style={styles.email}>Send your request to AI@ConiaSoft.com</Text>
          <Text style={styles.note}>Stay tuned for the revolutionary update.</Text>

          {/* Optional: Close button */}
          {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity> */}
          <Image 
              source={require('../assets/ConiaSoft_AI_Icon.png')}
              style={styles.overlayImage} // Style for the image
            /> 
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContent: {
    flex: 1,
    backgroundColor:'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  email: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: Platform.OS === 'android' ? 30 : 40,
  },
  note: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  closeButton: {
    marginTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  overlayImage:{
    // position: 'absolute', // Position image over the Lottie animation
    // top: '60%', // Adjust based on your needs
    // left: '50%', // Center horizontally
    // transform: [{ translateX: -20 }], // Adjust to center the image
    marginTop: 10,
    width: 40, // Adjust image size
    height: 40, // Adjust image size
    zIndex: 1, // Ensure it appears above the Lottie animation
  }
});

export default LottieModal;



