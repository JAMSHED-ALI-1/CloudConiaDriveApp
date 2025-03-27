import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { baseURL } from './src/utils/constant/settings';
import { useSelector } from 'react-redux';


const Test = ({  folderId=0, onSuccess, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = useSelector(state => state.auth.user);
  const workspaceId = useSelector(state => state.workspace.workspace);
  const handleFileUpload = async () => {
    try {
      const file = await ImagePicker.openPicker({
        multiple: false, // Pick only one file
        mediaType: 'any', // Allows all file types
      });

      console.log('Selected File:', file);

      const fileUri = Platform.OS === 'ios' ? file.path.replace('file://', '') : file.path;
      const fileName = file.filename || `upload.${file.mime.split('/')[1]}`; // Generate filename if not available
      const uploadUrl = `${baseURL}/uploads?workspaceId=${workspaceId}`;
      const token = user?.access_token;

      setIsRefreshing(true);

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

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData,'Mila h')

      setIsRefreshing(false);

      if (response.ok && responseData.status === 'success') {
        Alert.alert('Success', 'File uploaded successfully!');
        // onSuccess();
      } else {
        throw new Error(responseData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'File upload failed');
    } finally {
      setIsRefreshing(false);
      // setTimeout(onClose, 700);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={{ padding: 10, backgroundColor: 'red' }} onPress={handleFileUpload}>
        <Text style={{ color: 'white' }}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});
