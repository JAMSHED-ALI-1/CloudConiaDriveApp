import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import {useCreateFolderMutation} from '../redux/reducers/services/createFolder';
import {useSelector} from 'react-redux';
import strings from '../helper/Language/LocalizedStrings';
import DocumentPicker from 'react-native-document-picker';
import {baseURL} from '../utils/constant/settings';
import ReactNativeBlobUtil from 'react-native-blob-util'
import {
  AlertNotificationRoot,
  Dialog,
  ALERT_TYPE,
} from 'react-native-alert-notification';
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import SuccessAndFailModal from './SuccessAndFailModal';
import ImagePicker from 'react-native-image-crop-picker';
const FileFolderModal = ({
  visible,
  onClose,
  onUploadFile,
  onSuccess,
  folderId,
  user
}) => {
  // console.log('first',folderId)
  // console.log('mil gai Folder id----',folderId)

  const workspaceId = useSelector(state => state.workspace.workspace);
  const [folderName, setFolderName] = useState('');
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const [isrefreshing, setIsrefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lottie, setLottie] = useState(false);
  const [lotieUrl, setLottieUrl] = useState(
    require('../assets/data/UploadigAnimation.json'),
  );

  const [createFolder, {isLoading}] = useCreateFolderMutation();

  const handleCreateFolder = async () => {
    if (folderName.trim() === '') {
      setError('Please enter a folder name');
      return;
    }

    setError(''); // Clear any previous errors
    setLottie(true);

    try {
      const response = await createFolder({
        workspaceId,
        folderId: folderId ? folderId : 0, // Assuming 0 is the root folder ID
        folderName: folderName,
        token: user?.access_token,
      }).unwrap();

      console.log('Folder creation response:', response);

      if (response?.status === 'success' && response.folder) {
        showMessageHandler('Folder Created successfully', 'success');
        setLottieUrl(require('../assets/data/UploadigAnimation.json'));
        setLottie(true);
        onSuccess(); // Trigger the onSuccess callback to re-fetch data
        setFolderName(''); // Reset input
        setOpenCreateFolder(false);
      } else {
        throw new Error('Folder creation failed');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setError(error.message || 'There was an issue creating the folder.');
      showMessageHandler('There was an issue creating the folder.', 'Failed');
      setLottieUrl(require('../assets/data/failed.json'));
      setLottie(true);
    }
  };

  const handleOpenCreateFolder = () => {
    setOpenCreateFolder(true);
    onClose(); // Close FileFolderModal when opening CreateFolder
  };

  const handleCloseCreateFolder = () => {
    setOpenCreateFolder(false);
  };

  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const fileUri =
        Platform.OS === 'ios' ? res[0].uri.replace('file://', '') : res[0].uri;
      const fileName = res[0].name;
      const uploadUrl = `${baseURL}/uploads?workspaceId=${workspaceId}`;
      const token = user?.access_token;

      setIsrefreshing(true);

      const parentId = folderId ? folderId : null;

      const formData = [
        {
          name: 'file',
          filename: fileName,
          type: res[0].type,
          data: ReactNativeBlobUtil.wrap(fileUri),
        },
        {name: 'workspaceId', data: '0'},
        {name: 'parentId', data: parentId ? parentId.toString() : ''},
        {name: 'isSQL', data: 'false'},
        {name: 'disk', data: 'uploads'},
      ];

      console.log('Uploading file...'); // Add this log
      setLottieUrl(require('../assets/data/UploadigAnimation.json'));
      setLottie(true);
      setIsrefreshing(true);
      const response = await ReactNativeBlobUtil.fetch(
        'POST',
        uploadUrl,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );

      // console.log('Upload response:', response.data);
      setIsrefreshing(false); // Add this log

      if (
        response.respInfo.status === 200 ||
        response.respInfo.status === 201
      ) {
        const responseData = JSON.parse(response.data);
        // console.log('Parsed response data:', responseData); // Add this log
        if (responseData.status === 'success') {
          setLottieUrl(require('../assets/data/UploadigAnimation.json'));
          setLottie(true);
          showMessageHandler('File Uploaded successfully', 'success');

          onSuccess();
          // setLottieUrl(require('../assets/data/UploadigAnimation.json'))
          // setLottie(true);
          console.log('Upload successful, showing alert'); // Add this log
          // showAlert(ALERT_TYPE.SUCCESS, 'Success', 'File uploaded successfully!');
        } else {
          throw new Error(responseData.message || 'Upload failed');
        }
      } else {
        throw new Error(
          `Server responded with status ${response.respInfo.status}`,
        );
      }
    } catch (err) {
      console.error('Error in uploadFile:', err);
      showMessageHandler('FServer responded Error', 'failed');
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking cancelled');
      } else {
        let errorMessage = 'Failed to upload file';
        if (err.message) {
          errorMessage += ': ' + err.message;
        }
        showMessageHandler(ALERT_TYPE.DANGER, 'Error', errorMessage);
        setLottieUrl(require('../assets/data/failed.json'));
        setLottie(true);
      }
    } finally {
      setIsrefreshing(false);
      setTimeout(onClose, 700);
    }
  };


  const handleFileUpload = async () => {
    try {
      const file = await ImagePicker.openPicker({
        multiple: false, // Pick only one file
        mediaType: 'any', // Allows all file types
      });

      // console.log('Selected File:', file);

      const fileUri = Platform.OS === 'ios' ? file.path.replace('file://', '') : file.path;
      const fileName = file.filename || `upload.${file.mime.split('/')[1]}`; // Generate filename if not available
      const uploadUrl = `${baseURL}/uploads?workspaceId=${workspaceId}`;
      const token = user?.access_token;

      setIsrefreshing(true);

      const parentId = folderId ? folderId.toString() : '';

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: file.mime,
      });
      formData.append('workspaceId', workspaceId);
      formData.append('parentId', parentId);
      formData.append('isSQL', 'false');
      formData.append('disk', 'uploads');

      console.log('Uploading file...');
      setLottieUrl(require('../assets/data/UploadigAnimation.json'));
      setLottie(true);
      setIsrefreshing(true);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();
      // console.log(responseData,'Mila h')

      setIsrefreshing(false);

      if (response.ok && responseData.status === 'success') {
        showMessageHandler('File Uploaded successfully', 'success');

        onSuccess();
        // setLottieUrl(require('../assets/data/UploadigAnimation.json'))
        // setLottie(true);
        console.log('Upload successful, showing alert');
       
       
      } else {
        throw new Error(responseData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      showMessageHandler('FServer responded Error', 'failed');
      Alert.alert('Error', 'File upload failed');
      showMessageHandler(ALERT_TYPE.DANGER, 'Error', errorMessage);
        setLottieUrl(require('../assets/data/failed.json'));
        setLottie(true);
    } finally {
      setIsrefreshing(false);
      setTimeout(onClose, 700);
    }
  };
  return (
    <>
      {/* Main Modal for Upload File and Create Folder Options */}
      <Modal visible={visible} animationType="slide" transparent={true}>
        <TouchableOpacity
          onPress={onClose}
          style={styles.overlay}
          activeOpacity={1}>
          <View style={styles.whitespace}>
            {/* Upload File Button */}
            {/* <TouchableOpacity style={styles.iconContainer} onPress={onUploadFile}>
              <Icon name="cloud-upload" size={30} color={COLORS.blue} /> 
              <Text style={styles.iconText}>Upload File</Text>
            </TouchableOpacity> */}
            {lottie ? (
              <>
                <SuccessAndFailModal
                  visible={lottie}
                  onClose={() => setLottie(false)}
                  url={lotieUrl}
                />

                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleFileUpload}>
                  <Icon name="cloud-upload" size={30} color={COLORS.blue} />
                  <Text style={styles.iconText}>{strings.UPLOAD_FILE}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleOpenCreateFolder}>
                  <Icon name="folder" size={30} color={COLORS.blue} />
                  <Text style={styles.iconText}>{strings.CREATE_FOLDER}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleFileUpload}>
                  <Icon name="cloud-upload" size={30} color={COLORS.blue} />
                  <Text style={styles.iconText}>{strings.UPLOAD_FILE}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={handleOpenCreateFolder}>
                  <Icon name="folder" size={30} color={COLORS.blue} />
                  <Text style={styles.iconText}>{strings.CREATE_FOLDER}</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Create Folder Button */}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        visible={openCreateFolder}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseCreateFolder} // Close when pressing back button
      >
        <TouchableOpacity
          style={styles.overlay1}
          activeOpacity={1}
          onPress={handleCloseCreateFolder} // Close when clicking outside
        >
          <KeyboardAvoidingView
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {lottie ? (
              <SuccessAndFailModal
                visible={lottie}
                onClose={() => setLottie(false)}
                url={lotieUrl}
              />
            ) : (
              <View style={styles.modalContent}>
                <Text
                  style={{
                    fontSize: 20,
                    padding: 10,
                    color: COLORS.black,
                    fontWeight: '800',
                  }}>
                  {strings.CREATE_FOLDER}
                </Text>
                <View style={styles.textinputcontainer}>
                  <TextInput
                    placeholder="Enter folder name"
                    value={folderName}
                    onChangeText={text => setFolderName(text)}
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                      fontWeight: '500',
                    }}
                    placeholderTextColor={COLORS.black}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <CustomButton
                  buttonTitle={isLoading ? 'Creating...' : 'Submit'}
                  onPress={handleCreateFolder}
                  disabled={isLoading}
                />
              </View>
            )}
          </KeyboardAvoidingView>
        </TouchableOpacity>
        {lottie && (
          <SuccessAndFailModal
            visible={lottie}
            onClose={() => setLottie(false)}
            url={lotieUrl}
          />
        )}
      </Modal>
    </>
  );
};

export default FileFolderModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  whitespace: {
    height: '30%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: 15,
  },
  overlay1: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 15,
  },
  modalContent: {
    height: 300,
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  textinputcontainer: {
    backgroundColor: COLORS.white,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
