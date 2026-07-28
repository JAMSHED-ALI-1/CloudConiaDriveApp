import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Platform, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ImagepreviewModal = ({ visible, onClose, imageId, workspace, user }) => {
  const handleImageLoad = () => {
    console.log('Image loaded successfully');
  };
const img=`https://drive.coniacloud.com/api/v1/file-entries/${imageId}?workspaceId=${workspace}&thumbnail=true`
// console.log(img)
  const handleImageError = () => {
    console.log('Error loading image');
  };

  return (
    <SafeAreaView
    style={{flex:1}}>

    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    
      // onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient 
       colors={['#2B65B0','#6CA1E6','#6CA1E6', '#fbc2eb']} 
        style={{flex:1}}>

        
        <TouchableOpacity style={styles.modalContainer}  activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Icon name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
          <FastImage
            style={styles.imageThumbnail}
            resizeMode={FastImage.resizeMode.contain}
            // height={'100%'}
            source={{
              uri: `https://drive.coniacloud.com/api/v1/file-entries/${imageId}?workspaceId=${workspace}&thumbnail=true`,
              headers: { Authorization: `Bearer ${user?.access_token}` },
              priority: FastImage.priority.high,
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background to dim behind the image
    justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:COLORS.white
    // padding: 20,
    // backgroundColor:COLORS.white
  },
  imageThumbnail: {
    width: '100%',
    height: '100%', // Adjust image height to fit within the modal
    // resizeMode:'', // Make sure the image doesn't stretch
    borderRadius: 10,
    
  },
  closeIcon: {
    position: 'absolute',
    top: Platform.OS==='android'?20:50,
    right: 20,
    zIndex: 1, // Make sure the close button appears on top of the image
  },
});

export default ImagepreviewModal;
