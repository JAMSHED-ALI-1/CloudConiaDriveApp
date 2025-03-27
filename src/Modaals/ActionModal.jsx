import { Modal, StyleSheet, Text, View,TouchableOpacity,Image,Alert } from 'react-native'
import React,{useState} from 'react'
import strings from '../helper/Language/LocalizedStrings';
import ShareFileModal from './Share';
import ReactNativeBlobUtil from 'react-native-blob-util'
import RenameModal from './Rename';
import { baseURL } from '../utils/constant/settings';
import { makeApiCall } from '../helper/apiHelper';
import { COLORS } from '../utils/Colors';
import { useSelector } from 'react-redux';
import showMessageHandler from '../utils/constant/ShowMessageHandler';
const ActionModal = ({isVisible, onClose,user,item ,onSuccess}) => {
  // console.log('----->>>>',item)
  const workspaces = useSelector(state => state.workspace.workspace);
  const language = useSelector((state) => state.language.language);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const openrenameModal=()=>{
    setRenameModalVisible(true)
    onClose()
  }
  const openShareModal = () => {
    setShareModalVisible(true);
    onClose(); // Close the main modal
  };
//   const downloadFile = async () => {
//     try {
//       // Ensure item.hash and item.name are available
//       if (!item?.hash || !item?.name) {
//         console.error('File hash or name is missing');
//         return;
//       }

//       // Construct the download URL (you may need to adjust this based on your API)
//       const downloadUrl = `${baseURL}/api/v1/file-entries/download/${item.hash}?add-preview-token=${user?.access_token}`;

//       // Determine the local path where the file will be saved
//       const localFile = `${RNFS.DocumentDirectoryPath}/${item.name}`;

//       // Start the download
//       const result = await RNFS.downloadFile({
//         fromUrl: downloadUrl,
//         toFile: localFile,
//         progress: (res) => {
//           const progress = (res.bytesWritten / res.contentLength) * 100;
//           console.log(`Downloaded ${progress.toFixed(2)}%`);
//         },
//       }).promise;

//       if (result.statusCode === 200) {
//         console.log('File downloaded successfully');
//         // You can add a notification or alert here to inform the user
//       } else {
//         console.error('File download failed');
//       }
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//     onClose();
//   };
  const downloadFile = async () => {
    if (!item?.hash || !item?.name) {
      Alert.alert('Error', 'File information is missing');
      return;
    }

    const { fs } = ReactNativeBlobUtil;
    const downloadsPath = Platform.OS === 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;
    const fileName = item.name;
    const localPath = `${downloadsPath}/${fileName}`;

    // Replace this with your actual API URL
    const downloadUrl = `${baseURL}/api/v1/file-entries/download/${item.hash}?add-preview-token=${user?.access_token}`;

    try {
      const res = await ReactNativeBlobUtil
        .config({
          path: localPath,
          fileCache: true,
          appendExt: fileName.split('.').pop(),
        })
        .fetch('GET', downloadUrl, {
          // Add any necessary headers here
        })
        .progress((received, total) => {
          const percentage = (received / total) * 100;
          setDownloadProgress(percentage);
          console.log(`Downloaded ${percentage.toFixed(2)}%`);
        });

      console.log('File downloaded and saved locally at:', res.path());
      showMessageHandler('Success', 'File downloaded successfully!');
    } catch (error) {
      console.error('Error downloading the file:', error.message);
      showMessageHandler('Error', 'Failed to download the file.');
    } finally {
      setDownloadProgress(0);
      onClose();
    }
  };
    

  // const deleteFile = async () => {
  //   try {
  //     let data = {
  //       entryIds: [item?.id],
  //       deleteForever: 0,
  //     };
  //     await makeApiCall(`/api/v1/file-entries/delete?workspaceId=${workspaces}`, user?.access_token, 'post', data);
      
  //     Alert.alert('Success', 'File deleted successfully!');
  //     onClose(); 
  //   } catch (error) {
  //     console.error('Error deleting file:', error);
  //     Alert.alert('Error', 'Error deleting file.');
  //   }
  // };
  const deleteFile = async () => {
    Alert.alert(
      "Confirm Delete",
      "Do you really want to delete this file?",
      [
        {
          text: "No",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel", // Makes the "No" button more prominent as a cancel action
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              let data = {
                entryIds: [item?.id],
                deleteForever: 0,
              };
              await makeApiCall(`/api/v1/file-entries/delete?workspaceId=${workspaces}`, user?.access_token, 'post', data);
              showMessageHandler('Success', 'File deleted successfully!');
              onSuccess()
              onClose();
            } catch (error) {
              console.error('Error deleting file:', error);
              showMessageHandler('Error', 'Error deleting file.');
            }
          },
        },
      ],
      { cancelable: false } 
    );
  };
  
  

  return (
   <>
    <Modal
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <TouchableOpacity style={styles.modalContainer} onPress={onClose} activeOpacity={1}>
      <View style={styles.modalContent}>
      <View style={styles.header}>
      <Text style={styles.modalTitle}>{strings.File_Options}</Text>
      <TouchableOpacity onPress={onClose}>
        <Image
          source={require('../assets/icons/close.png')}
          style={styles.closeIcon}
        />
      </TouchableOpacity>
    </View>
        <TouchableOpacity style={styles.itemContainer} 
       onPress={openShareModal}
        >
          <Image source={require('../assets/icons/share.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.SHARE}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} 
      onPress={downloadFile}
        >
          <Image source={require('../assets/icons/fi_download.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.DOWNLOAD}</Text>
        </TouchableOpacity>
        {downloadProgress > 0 && (
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${downloadProgress}%` }]} />
              </View>
            )}
        <TouchableOpacity style={styles.itemContainer} 
        onPress={openrenameModal}
        >
          <Image source={require('../assets/Modalicon/fi_edit-2.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.RENAME}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemContainer} 
        onPress={deleteFile}
        >
          <Image source={require('../assets/Modalicon/fi_trash-2.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.DELETEFILE}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
  <ShareFileModal 
  isVisible={isShareModalVisible} 
  onClose={()=>setShareModalVisible(false)} 
  item={item} 
  user={user}/>
  <RenameModal 
  isVisible={isRenameModalVisible} 
  onClose={()=>setRenameModalVisible(false)} 
  item={item} 
  onSuccess={onSuccess}
  user={user}/>
   </>
  )
}

export default ActionModal

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
        // paddingVertical:60
      },
      modalContent: {
        height: '40%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
        // paddingVertical:40
        // paddingBottom: Platform.OS==='android'?60:10
      
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      },
      image: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        marginRight: 15,
      },
      closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
      },
      closeIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.noermalText
      },
      progressBar: {
        height: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginTop: 10,
      },
      progress: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 5,
      },
      nornalText:{
        fontSize:14,
        color:COLORS.noermalText,
        fontWeight:'600'
      }
})



