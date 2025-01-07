
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  SafeAreaView, 
  Alert
} from 'react-native';
import FastImage from 'react-native-fast-image'; // Recommended library for faster image loading
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import { baseURL } from '../../utils/constant/settings';

const ImageViewer = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const accessToken = user?.access_token;
  const imageId = filePath?.id;
  const workspaces = useSelector(state => state.workspace.workspace);

  const [imageSource, setImageSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImage = useCallback(async () => {
    if (!imageId || !accessToken) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    try {
      const previewUrl = `${baseURL}/file-entries/${imageId}?workspaceId=${workspaces}&thumbnail=true`;
      
      // Preemptively check image accessibility
      const response = await fetch(previewUrl, {
        method: 'HEAD', // Lightweight request to check availability
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
     
      if (!response.ok) {
        
        if (response.status === 403) {
          Alert.alert(
            'Access Denied',
            'Your session has expired. Please log in again.',
            [
              { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]
          );
        }
        throw new Error(`Failed to load image: ${response.status}`);
      }

      setImageSource({
        uri: previewUrl,
        priority: FastImage.priority.high,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
    } catch (err) {
      console.error('Error loading image:', err);
      setError('Failed to load image');
    } finally {
      setIsLoading(false);
    }
  }, [imageId, accessToken, workspaces]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  const handleImageError = (error) => {
    console.error('Image loading error:', error);
    setError('Failed to load image');
    setIsLoading(false);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader 
          back={true} 
          left={true} 
          OnPress={() => navigation.goBack()} 
          title={'Images Viewer'}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading image...</Text>
          </View>
        )}
        
        {!!imageSource  ? (
          <FastImage
            source={imageSource}
            style={styles.image}
            resizeMode={FastImage.resizeMode.contain}
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
            cache={FastImage.cacheControl.immutable} 
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15
  },
  image: {
    width: '100%',
    height: '100%'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: '#000',
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  }
});

export default ImageViewer;