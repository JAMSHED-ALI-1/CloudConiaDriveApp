// import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import { COLORS } from '../utils/Colors';
// import { makeApiCall } from '../helper/apiHelper';
// const Trashremove = ({visible, onClose,user, item }) => {
//     const restoreFile=async()=>{
//         let data = {
//             entryIds: [item?.id],
//           }
//         const responce=await makeApiCall('/api/v1/file-entries/restore', user?.access_token, 'post', data);
//         console.log('restore responce',responce)
//         if(responce.status==='success'){
//             onClose()
//         }
//     }
//   return (
//     <>
//      <Modal
//         animationType="slide"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
//           <View style={styles.modalContainer}>
//             <TouchableOpacity style={styles.modalItem} 
//             onPress={restoreFile}>
//               <Image source={require('../assets/icons/Revert.jpg')} style={styles.modalIcon} />
//               <Text style={{color:COLORS.noermalText}}>Recovery</Text>
//             </TouchableOpacity>
            
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   )
// }

// export default Trashremove

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//         justifyContent: 'flex-end', // Align modal content to the bottom
//         width: '100%',
//       },
//       modalContainer: {
//         backgroundColor: '#fff',
//         padding: 40,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//       },
//       modalItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 10,
//       },
//       modalIcon: {
//         width: 30,
//         height: 30,
//         marginRight: 20,
//       },
    
    
// })

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
const Trashremove = ({ visible, onClose,user, item ,onSuccess}) => {
  const language = useSelector((state) => state.language.language);
  const [folderModalVisible, setFolderModalVisible] = useState(false); 
  const [folderName, setFolderName] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const workspaces = useSelector(state => state.workspace.workspace);
 
 


  const restoreFile=async()=>{
            let data = {
                entryIds: [item?.id],
              }
            const responce=await makeApiCall('/api/v1/file-entries/restore', user?.access_token, 'post', data);
            console.log('restore responce',responce)
            if(responce.status==='success'){
                onClose()
                onSuccess()
            }
        }
        const permanentDelete = async () => {
          try {
            let data = {
              entryIds: [item?.id],
              deleteForever: true,
            };
            const response = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);
            // console.log('Permanent delete response:', response);
            if (response?.status === 'success') {
              Alert.alert('Success', 'File permanently deleted!');
              onSuccess()
              onClose();
            } else {
              Alert.alert('Error', 'Failed to delete file permanently.');
            }
          } catch (error) {
            console.error('Error permanently deleting file:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
          }
        };
      
        const confirmPermanentDelete = () => {
          Alert.alert(
            "Confirm Permanent Delete",
            "This action cannot be undone. Do you want to permanently delete this file?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Permanent delete cancelled"),
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: permanentDelete,
              },
            ],
            { cancelable: false }
          );
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
            await restoreFile();
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
            <Image source={require('../assets/FileFolderIcons/delete.png')} style={styles.modalIcon} tintColor={COLORS.blue}/>
              <Text style={styles.nornalText}>{strings.Recovery}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); confirmPermanentDelete(); }}>
            <Image source={require('../assets/FileFolderIcons/permadelete.png')} style={styles.modalIcon}  tintColor={COLORS.blue}/>
              <Text style={styles.nornalText}>{strings.Permanently_Delete}</Text>
            </TouchableOpacity>
            
            
          </View>
        </TouchableOpacity>
      </Modal>

  
    </>
  );
};

export default Trashremove;

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
