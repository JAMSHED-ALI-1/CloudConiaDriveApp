import { Modal, StyleSheet, Text, View,TouchableOpacity,Image,Alert, Platform } from 'react-native'
import React,{useState} from 'react'
import strings from '../helper/Language/LocalizedStrings';
import ShareFileModal from './Share';
import ReactNativeBlobUtil from 'react-native-blob-util'
import RenameModal from './Rename';
import { baseURL } from '../utils/constant/settings';
import { makeApiCall } from '../helper/apiHelper';
import { COLORS } from '../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '../helper/Logouthelper';
import ImagepreviewModal from './ImagepreviewModal';
// import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from './Share';
import requestStoragePermission from '../utils/Permission';
import getMimeType from '../utils/GetmimeType';
const ActionModal = ({isVisible, onClose,user,item ,onSuccess}) => {
  const navigation=useNavigation()
  const dispatch = useDispatch();
  // console.log('Jamshed----->>>>',item.type)
  const workspaces = useSelector(state => state.workspace.workspace);
  const language = useSelector((state) => state.language.language);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [handleImageViewMidal,setImageViewModal]=useState(false)
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);
  const [modalOpenKey, setModalOpenKey] = useState(0);
 

  const openrenameModal=()=>{
    setRenameModalVisible(true)
    onClose()
  }
  const openShareModal = () => {
    setShareModalVisible(true);
    setModalOpenKey(prev => prev + 1); 
    onClose(); // Close the main modal
  };
  const handleMakeCopy = async () => {
    const resolvedWorkspace = workspaces && workspaces !== 0 ? workspaces : null;

    const url = resolvedWorkspace
      ? `/api/v1/file-entries/duplicate?workspaceId=${resolvedWorkspace}`
      : `/api/v1/file-entries/duplicate`;
    
  
    console.log('Item ID:', item.id); // Debug check
  
    const payload = {
      entryIds: [item?.id], // Make sure this is a valid array
    };
  
    try {
      const response = await makeApiCall(
        `/api/v1/file-entries/duplicate?workspaceId=${workspaces}`,
        user?.access_token,
        'post',
        payload
      );
        
      console.log('✅ Duplication response:', response);
      if (response?.status === 'success') {
        showMessageHandler('Success', 'File duplicated successfully!');
        onSuccess(); // Notify parent to refresh
        onClose();
      }
    } catch (error) {
      console.log('❌ Duplication error:', error?.response?.data || error);
    }
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
  // const downloadFile = async () => {
  //   if (!item?.hash || !item?.name) {
  //     Alert.alert('Error', 'File information is missing');
  //     return;
  //   }
  
  //   const { dirs } = RNFetchBlob.fs;
  //   const downloadsPath = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;

  //   console.log(downloadsPath,'path')
  //   const fileName = item.name;
  //   const localPath = `${downloadsPath}/${fileName}`;

  //   // Replace this with your actual API URL
  //   const downloadUrl = `${baseURL}/api/v1/file-entries/download/${item.hash}?add-preview-token=${user?.access_token}`;

  //   try {
  //     const res = await ReactNativeBlobUtil
  //       .config({
  //         path: localPath,
  //         fileCache: true,
  //         appendExt: fileName.split('.').pop(),
  //       })
  //       .fetch('GET', downloadUrl, {
  //         // Add any necessary headers here
  //       })
  //       .progress((received, total) => {
  //         const percentage = (received / total) * 100;
  //         setDownloadProgress(percentage);
  //         console.log(`Downloaded ${percentage.toFixed(2)}%`);
  //       });

  //     console.log('File downloaded and saved locally at:', res.path());
  //     showMessageHandler('Success', 'File downloaded successfully!');
  //   } catch (error) {
  //     console.error('Error downloading the file:', error.message);
  //     showMessageHandler('Error', 'Failed to download the file.');
  //   } finally {
  //     setDownloadProgress(0);
  //     onClose();
  //   }
  // };
    


  // const downloadFile = async () => {
  //   if (!item?.hash || !item?.name) {
  //     Alert.alert('Error', 'File information is missing');
  //     return;
  //   }
  
  //   // const hasPermission = await requestStoragePermission();
  //   // if (!hasPermission) {
  //   //   Alert.alert('Permission Denied', 'Storage access is required to download files.');
  //   //   return;
  //   // }
  
  //   const { fs } = ReactNativeBlobUtil;
  //   const downloadsPath = fs.dirs.DownloadDir;
  //   const fileName = item.name;
  //   const filePath = `${downloadsPath}/${fileName}`;
  //   const fileExt = fileName.split('.').pop();
  //   const mimeType = `application/${fileExt}`;
  
  //   const downloadUrl = `${baseURL}/api/v1/file-entries/download/${item.hash}?add-preview-token=${user?.access_token}`;
  
  //   try {
  //     const res = await ReactNativeBlobUtil.config({
  //       fileCache: true,
  //       addAndroidDownloads: {
  //         useDownloadManager: true,
  //         notification: true,
  //         title: fileName,
  //         path: filePath,
  //         description: 'Downloading file...',
  //         mime: mimeType,
  //         mediaScannable: true,
  //       },
  //     })
  //     .fetch('GET', downloadUrl)
  //     .progress((received, total) => {
  //       const percentage = (received / total) * 100;
  //       setDownloadProgress(percentage);
  //       console.log(`Downloading: ${percentage.toFixed(2)}%`);
  //     });
  
  //     console.log('Download complete. File saved to:', res.path());
  //     showMessageHandler('Success', 'File downloaded successfully!');
  //   } catch (error) {
  //     console.error('Download error:', error.message);
  //     showMessageHandler('Error', 'Download failed.');
  //   } finally {
  //     setDownloadProgress(0);
  //     onClose();
  //   }
  // };



  const downloadFile = async () => {
    const { fs } = ReactNativeBlobUtil;
    const fileName = item.name;  // Get file name
    const downloadUrl = `${baseURL}/api/v1/file-entries/download/${item.hash}?add-preview-token=${user?.access_token}`; // Replace with your URL
  
    const downloadsDir = Platform.Version >= 29
      ? fs.dirs.LegacyDownloadDir
      : fs.dirs.DownloadDir;
  
    const fullPath = `${downloadsDir}/${fileName}`;
    console.log('Download path:', fullPath);
  
    // Get MIME type dynamically
    const mimeType = getMimeType(fileName);
    console.log('Detected MIME type:', mimeType);
  
    try {
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: fullPath,
          title: fileName,
          description: 'Downloading file...',
          mediaScannable: true,
          mime: mimeType,  // Dynamically set MIME type
        }
      }).fetch('GET', downloadUrl);
  
      console.log('✅ File downloaded to:', res.path());
    } catch (err) {
      console.log('❌ Download failed:', err.message);
    }
  };
  const makeStarredFile = async () => {
    try {
      const data = {
        entryIds: [item?.id],
        starred: 1,
      };
      const res = await makeApiCall(
        `/api/v1/file-entries/star?workspaceId=${workspaces}`,
        user?.access_token,
        'post',
        data
      );
  
      if (res?.status === 'success' && res?.tag?.name === 'starred') {
        showMessageHandler('Success', 'File starred successfully!');
        onSuccess(); // Notify parent to refresh
        onClose();
      } else {
        showMessageHandler('Error', 'Could not star the file.');
      }
    } catch (error) {
      console.error('Error starring file:', error);
      showMessageHandler('Error', 'Error starring file.');
    }
  };
  
const makeUnstarredFile = async () => {
  try {
    let data = {  
      entryIds: [item?.id],
      starred: 0,
    };
   const res= await makeApiCall(`/api/v1/file-entries/unstar?workspaceId=${workspaces}`, user?.access_token, 'post', data);
    showMessageHandler('Success', 'File unstarred successfully!');
    console.log(res,'Unshered')
    onSuccess()
    onClose();
  } catch (error) {
    console.error('Error unstarring file:', error);
    showMessageHandler('Error', 'Error unstarring file.');
  }
}



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
                deleteForever: false,
              };
             await makeApiCall(`/api/v1/file-entries/delete?workspaceId=${workspaces}`, user?.access_token, 'post', data);
              showMessageHandler('Success', 'File deleted successfully!');
             
              onSuccess()
              onClose();
            } catch (error) {
              console.error('Error deleting file:', error);
              showMessageHandler('Error', 'Error deleting file.');
              handleLogout(dispatch,navigation)
            }
          },
        },
      ],
      { cancelable: false } 
    );
  };
  
  
  const isStarred = item?.tags?.some(tag => tag.name === 'starred');

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
  {item?.type==='image'&& <TouchableOpacity style={styles.itemContainer} 
  onPress={() => {
    setSelectedPreviewItem(item);   // Set item before opening modal
    onClose();                      // Close parent modal
    setImageViewModal(true);       // Open preview modal
  }}
     
   
        >
          <Image source={require('../assets/icons/Move.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.Preview}</Text>


          
        </TouchableOpacity>}
        {item?.permissions?.["files.update"] && (
  <TouchableOpacity style={styles.itemContainer} onPress={openShareModal}>
    <Image source={require('../assets/icons/Shared.png')} style={styles.image} />
    <Text style={styles.nornalText}>{strings.SHARE}</Text>
  </TouchableOpacity>
)}
       {item?.permissions?.['files.download'] &&(<TouchableOpacity style={styles.itemContainer} 
      onPress={downloadFile}
        >
          <Image source={require('../assets/icons/Download.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.DOWNLOAD}</Text>
        </TouchableOpacity>)}
        {downloadProgress > 0 && (
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${downloadProgress}%` }]} />
              </View>
            )}
             {item?.permissions?.['files.download'||'files.update'] &&(<TouchableOpacity style={styles.itemContainer} 
      onPress={handleMakeCopy}
        >
          <Image source={require('../assets/icons/Makeacopy.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.MAKE_ACOPY}</Text>
        </TouchableOpacity>)}
        {downloadProgress > 0 && (
              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${downloadProgress}%` }]} />
              </View>
            )}
      {item?.permissions?.['files.update'] && <TouchableOpacity style={styles.itemContainer} 
        onPress={openrenameModal}
        >
          <Image source={require('../assets/icons/Rename.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.RENAME}</Text>
        </TouchableOpacity>}
        {item?.permissions?.['files.delete']&&<TouchableOpacity style={styles.itemContainer} 
        onPress={deleteFile}
        >
          <Image source={require('../assets/icons/Trash.png')} style={styles.image} />
          <Text style={styles.nornalText}>{strings.REMOVE}</Text>
        </TouchableOpacity>}
       
      {item?.permissions?.['files.update'] &&  <TouchableOpacity
  style={styles.itemContainer}
  onPress={() => {
    if (isStarred) {
      makeUnstarredFile();
    } else {
      makeStarredFile();
    }
  }}
>
  <Image
    source={
      item?.tag?.name === 'starred' || item?.starred === 1
        ? require('../assets/icons/Starred.png') 
        : require('../assets/icons/Starred.png')
    }
    style={styles.image}
  />
  <Text style={styles.nornalText}>
    {isStarred
      ? strings.REMOVE_FROM_STAR
      : strings.ADD_TO_STAR}
  </Text>
</TouchableOpacity>}

      </View>
    </TouchableOpacity>
  </Modal>
  <Share 
  isVisible={isShareModalVisible} 
  onClose={()=>setShareModalVisible(false)} 
  item={item}
  onSuccess={onSuccess}
  workspace={workspaces} 
  openKey={modalOpenKey}
  user={user}/>
  <RenameModal 
  isVisible={isRenameModalVisible} 
  onClose={()=>setRenameModalVisible(false)} 
  item={item} 
  onSuccess={onSuccess}
  user={user}/>
   {/* <ImagepreviewModal
          visible={handleImageViewMidal}
          workspace={workspaces}
          onClose={()=>setImageViewModal(false)}
          imageId={item.id}
          user={user}
          /> */}
          <ImagepreviewModal
  visible={handleImageViewMidal}
  workspace={workspaces}
  onClose={() => setImageViewModal(false)}
  imageId={selectedPreviewItem?.id}   // Now comes from local state
  user={user}
/>
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
        // height: '60%',
        paddingBottom:20,
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
        height: 35,
        width: 35,
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
        fontSize:16,
        color:COLORS.noermalText,
        fontWeight:'700'
      }
})



