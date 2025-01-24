import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ActivityIndicator, SafeAreaView,KeyboardAvoidingView, Alert } from 'react-native';
import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import React, { useCallback, useState } from 'react';
import { makeApiCall } from '../helper/apiHelper';
import { baseURL } from '../utils/constant/settings';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { COLORS } from '../utils/Colors';
import { useSelector } from 'react-redux';
import strings from '../helper/Language/LocalizedStrings';
import axios from 'axios';
const UnshareModal = ({ visible, onClose,user, folderId  }) => {
  // const language = useSelector((state) => state.language.language);
  const [folderModalVisible, setFolderModalVisible] = useState(false); 
  const [folderName, setFolderName] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const workspaces = useSelector(state => state.workspace.workspace);
  const toggleFolderModal = () => {
    setFolderModalVisible(!folderModalVisible);
  };
  const showAlert = useCallback((type, title, message) => {
    console.log('Showing alert:', type, title, message);
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        Alert.alert(title, message);
      }, 100);
    } else {
      Dialog.show({
        type: type,
        title: title,
        textBody: message,
        button: 'close',
      });
    }
  }, []);


  const removeItem = async () => {
    try {
      const url = `https://drive.coniacloud.com/api/v1/file-entries/${folderId?.id}/unshare`;
      const token = user?.access_token;
  
      if (!token) {
        showAlert(ALERT_TYPE.WARNING, 'Authorization Error', 'No access token found. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        url,
        { userId: "me" }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Properly formatted Bearer token
            'Content-Type': 'application/json',
          },
        }
      );
  
      // console.log('Successfully unshared:', response.data);
      showAlert(ALERT_TYPE.SUCCESS, 'Success', 'Item unshared successfully!');
    } catch (error) {
      console.error('Error unsharing item:', error);
      const errorMessage = error.response?.data?.message || 'Failed to unshare item.';
      showAlert(ALERT_TYPE.DANGER, 'Error', errorMessage);
    }
  };
  
  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Do you really want to delete this file?",
      [
        {
          text: "No",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel", // Highlights "No" as the cancel action
        },
        {
          text: "Yes",
          onPress: async () => {
            console.log("Proceeding with delete");
            await removeItem();
            Alert.alert('Successfully removed Item')
            onClose();
          },
        },
      ],
      { cancelable: false } // Prevents closing the alert by tapping outside
    );
  };
  
  



  return (
   
    <>
    
      {/* Main Modal for Upload and Create */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); confirmDelete(); }}>
            <Image source={require('../assets/FileFolderIcons/delete.png')} style={styles.modalIcon} tintColor={COLORS.blue} />
              <Text style={styles.nornalText}>{strings.Permanently_Delete}</Text>
            </TouchableOpacity>
           
            
            
          </View>
        </TouchableOpacity>
      </Modal>

  
    </>
  );
};

export default UnshareModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'flex-end', // Align modal content to the bottom
    width: '100%',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom:Platform.OS==='android'?65:0
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    resizeMode:'contain'
  },
  centerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderModalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    color:COLORS.noermalText
  },
  createButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nornalText:{
    fontWeight:'600',
    fontSize:14,
    color:COLORS.black
  }
});
