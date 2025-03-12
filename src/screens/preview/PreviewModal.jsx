import React, { useState, useCallback } from 'react';
import { 
  Modal, 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  ActivityIndicator, 
  Text 
} from 'react-native';
import Video from 'react-native-video';
// import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { baseURL } from '../../utils/constant/settings';

const MediaPreview = ({ visible, fileUri, fileType, onClose, navigation }) => {
  const [imageSource, setImageSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspace.workspace);

  const accessToken = user?.access_token;
  const imageId = fileUri?.id;

  const loadImage = useCallback(async () => {
    if (!imageId || !accessToken) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const previewUrl = `${baseURL}/file-entries/${imageId}?workspaceId=${workspaces}&thumbnail=true`;

      const response = await fetch(previewUrl, {
        method: 'HEAD',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          Alert.alert(
            'Access Denied',
            'Your session has expired. Please log in again.',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        }
        throw new Error(`Failed to load image: ${response.status}`);
      }

      setImageSource({
        uri: previewUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error('Error loading image:', err);
      setError('Failed to load image');
    } finally {
      setIsLoading(false);
    }
  }, [imageId, accessToken, workspaces, navigation]);

  React.useEffect(() => {
    if (visible) {
      setError(null);
      setImageSource(null);
      if (fileType === 'image') {
        loadImage();
      }
    }
  }, [visible, fileUri, fileType, loadImage]);

  const renderMediaContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    const fileExtension = fileUri?.extension?.toLowerCase();

    // Image preview
    if (fileType === 'image' && imageSource) {
      return (
        <Image
          style={styles.mediaPreview}
          source={imageSource}
          resizeMode="contain"
        />
      );
    }

    // Video preview
    if (fileType === 'video' || 
        ['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(fileExtension)) {
      return (
        <Video
          source={{ uri: fileUri?.file_url }}
          style={styles.mediaPreview}
          controls={true}
          resizeMode="contain"
        />
      );
    }

    // PDF preview
    // if (fileType === 'pdf' || fileExtension === 'pdf') {
    //   return (
    //     <Pdf
    //       source={{ uri: fileUri?.file_url, cache: true }}
    //       style={styles.mediaPreview}
    //       onLoadComplete={(numberOfPages) => {
    //         console.log(`Number of pages: ${numberOfPages}`);
    //       }}
    //       onError={(error) => {
    //         console.log('PDF error:', error);
    //       }}
    //     />
    //   );
    // }

    // Document preview (basic)
    if (['doc', 'docx', 'txt', 'rtf'].includes(fileExtension)) {
      return (
        <View style={styles.documentPreview}>
          <Text style={styles.documentText}>
            Document preview not supported. 
            File: {fileUri?.name}
          </Text>
        </View>
      );
    }

    // Spreadsheet/Presentation preview (basic)
    if (['xls', 'xlsx', 'csv', 'ppt', 'pptx'].includes(fileExtension)) {
      return (
        <View style={styles.documentPreview}>
          <Text style={styles.documentText}>
            {fileExtension.toUpperCase()} preview not supported. 
            File: {fileUri?.name}
          </Text>
        </View>
      );
    }

    // Audio preview (basic)
    if (['mp3', 'wav', 'aac', 'flac'].includes(fileExtension)) {
      return (
        <View style={styles.documentPreview}>
          <Text style={styles.documentText}>
            Audio preview not supported. 
            File: {fileUri?.name}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.documentPreview}>
        <Text style={styles.documentText}>
          Unsupported file type: {fileExtension}
        </Text>
      </View>
    );
  };

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>
        {renderMediaContent()}
      </View>
    </Modal>
  );
};



export default MediaPreview;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPreview: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  documentPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  documentText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

