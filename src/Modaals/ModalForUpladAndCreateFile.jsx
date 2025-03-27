// import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ActivityIndicator, SafeAreaView,KeyboardAvoidingView, Alert } from 'react-native';
// import { AlertNotificationRoot, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
// import React, { useCallback, useState } from 'react';
// import { makeApiCall } from '../helper/apiHelper';
// import { baseURL } from '../utils/constant/settings';
// import DocumentPicker from 'react-native-document-picker';
// import RNFetchBlob from 'rn-fetch-blob';
// import { COLORS } from '../utils/Colors';
// import { useSelector } from 'react-redux';
// import strings from '../helper/Language/LocalizedStrings';
// const ModalForUploadAndCreateFile = ({ visible, onClose, onUpload, uploadFolder,user, folderId ,refreshing }) => {
//   // const language = useSelector((state) => state.language.language);
//   const [folderModalVisible, setFolderModalVisible] = useState(false); 
//   const [folderName, setFolderName] = useState(''); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const workspaces = useSelector(state => state.workspace.workspace);
//   const toggleFolderModal = () => {
//     setFolderModalVisible(!folderModalVisible);
//   };
//   const showAlert = useCallback((type, title, message) => {
//     console.log('Showing alert:', type, title, message);
//     if (Platform.OS === 'ios') {
//       setTimeout(() => {
//         Alert.alert(title, message);
//       }, 100);
//     } else {
//       Dialog.show({
//         type: type,
//         title: title,
//         textBody: message,
//         button: 'close',
//       });
//     }
//   }, []);
//   // Handle folder creation
 
//   const createFolder = async () => {
//     if (folderName.trim() === "") {
//       setError('Please enter a folder name');
//       return;
//     }

//     setError('');
//     setIsLoading(true);

//     try {
//       const response = await makeApiCall(`/api/v1/folders?workspaceId=${workspaces}`, user?.access_token, 'post', {
//         parentId: folderId === 0 ? null : folderId,
//         name: folderName,
//       });
//       // console.log('Creating Folder', response);
//       if (response?.status === 'success' && response.folder) {
//         showAlert(ALERT_TYPE.SUCCESS, 'Success', 'Folder successfully created!');
//         toggleFolderModal();
//         refreshing=true
//         setFolderName('');
//       } else {
//         throw new Error('Folder creation failed');
//       }
//     } catch (error) {
//       console.error('Error creating folder:', error);
//       showAlert(ALERT_TYPE.DANGER, 'Error', error.message || "There was an issue creating the folder.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Trigger the file upload function passed from the parent
  
//   const uploadFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.allFiles],
//       });
//       const fileUri = Platform.OS === 'ios' ? res[0].uri.replace('file://', '') : res[0].uri;
//       const fileName = res[0].name;
//       const uploadUrl = `${baseURL}/uploads?workspaceId=${workspaces}`;
//       const token = user?.access_token;

//       setIsLoading(true);

//       const parentId = folderId ? folderId : null;

//       const formData = [
//         { name: 'file', filename: fileName, type: res[0].type, data: RNFetchBlob.wrap(fileUri) },
//         { name: 'workspaceId', data: '0' },
//         { name: 'parentId', data: parentId ? parentId.toString() : '' },
//         { name: 'isSQL', data: 'false' },
//         { name: 'disk', data: 'uploads' },
//       ];

//       console.log('Uploading file...'); // Add this log
//       setIsLoading(true)
//       const response = await RNFetchBlob.fetch('POST', uploadUrl, {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       }, formData);
      
//       // console.log('Upload response:', response.data); 
//       setIsLoading(false)// Add this log

//       if (response.respInfo.status === 200 || response.respInfo.status === 201) {
//         const responseData = JSON.parse(response.data);
//         // console.log('Parsed response data:', responseData); // Add this log
//         if (responseData.status === 'success') {
//           console.log('Upload successful, showing alert'); // Add this log
//           showAlert(ALERT_TYPE.SUCCESS, 'Success', 'File uploaded successfully!');
//         } else {
//           throw new Error(responseData.message || 'Upload failed');
//         }
//       } else {
//         throw new Error(`Server responded with status ${response.respInfo.status}`);
//       }
//     } catch (err) {
//       console.error('Error in uploadFile:', err); 
//       if (DocumentPicker.isCancel(err)) {
//         console.log('Document picking cancelled');
//       } else {
//         let errorMessage = 'Failed to upload file';
//         if (err.message) {
//           errorMessage += ': ' + err.message;
//         }
//         showAlert(ALERT_TYPE.DANGER, 'Error', errorMessage);
//       }
//     } finally {
//       setIsLoading(false);
//       setTimeout(onClose, 700);
//     }
//   };


//   return (
   
//     <>
    
//       {/* Main Modal for Upload and Create */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
//           <View style={styles.modalContainer}>
//             <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); toggleFolderModal(); }}>
//               <Image source={require('../assets/FileFolderIcons/SharedFolderFileIcon.png')} style={styles.modalIcon} />
//               <Text style={styles.nornalText}>{strings.CREATE_FOLDER}</Text>
//             </TouchableOpacity>
//             {
//               isLoading?(<ActivityIndicator size={'large'} color={COLORS.blue}/>):
//               <TouchableOpacity style={styles.modalItem} onPress={uploadFile}>
//               <Image source={require('../assets/FileFolderIcons/ArchiveFileIcon.png')} style={styles.modalIcon} />
//               <Text style={styles.nornalText}>{strings.UPLOAD_FILE}</Text>
//             </TouchableOpacity>
//             }
//             {/* <TouchableOpacity style={styles.modalItem} onPress={uploadFile}>
//               <Image source={require('../assets/FileFolderIcons/ArchiveFileIcon.png')} style={styles.modalIcon} />
//               <Text style={styles.nornalText}>Upload File</Text>
//             </TouchableOpacity> */}
//             <TouchableOpacity style={styles.modalItem} onPress={uploadFile}>
//               {/* <Image source={require('../assets/icon/spreadsheet.png')} style={styles.modalIcon} /> */}
//               {/* <Text style={styles.nornalText}>Upload File</Text> */}
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Folder Creation Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={folderModalVisible}
//         onRequestClose={toggleFolderModal}
//       >
//         <TouchableOpacity style={styles.overlay} onPress={toggleFolderModal} activeOpacity={1}>
//           <View style={styles.centerModal}>
//             <View style={styles.folderModalContainer}>
//               <TextInput
//                 placeholder="Enter Folder Name"
//                 style={styles.input}
//                 value={folderName}
//                 placeholderTextColor={COLORS.noermalText}
//                 onChangeText={setFolderName} // Capture the folder name in state
//               />
//               <TouchableOpacity style={styles.createButton} onPress={createFolder}>
//                 <Text style={styles.nornalText}>{strings.CREATE_FOLDER}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// export default ModalForUploadAndCreateFile;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//     justifyContent: 'flex-end', // Align modal content to the bottom
//     width: '100%',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//      paddingBottom: Platform.OS==='android'?60:10
//   },
//   modalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   modalIcon: {
//     width: 30,
//     height: 30,
//     marginRight: 20,
//     resizeMode:'contain'
//   },
//   centerModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   folderModalContainer: {
//     backgroundColor: '#fff',
//     width: '90%',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   input: {
//     width: '100%',
//     padding: 10,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 15,
//     color:COLORS.noermalText
//   },
//   createButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   nornalText:{
//     fontWeight:'600',
//     fontSize:14,
//     color:COLORS.black
//   }
// });




import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ModalForUpladAndCreateFile = () => {
  return (
    <View>
      <Text>ModalForUpladAndCreateFile</Text>
    </View>
  )
}

export default ModalForUpladAndCreateFile

const styles = StyleSheet.create({})