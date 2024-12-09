import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet,Text ,ActivityIndicator, SafeAreaView } from 'react-native';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../components/CustomHeader';
import { baseURL } from '../../utils/constant/settings';

const ImageViewer = ({ route,navigation }) => {
  const { filePath, user, } = route.params;
  const accessToken = user?.access_token;
  const imageId = filePath?.id;
  const workspaces = useSelector(state => state.workspace.workspace);
  const [imageSource, setImageSource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageId || !accessToken) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        const previewUrl = `${baseURL}/file-entries/${imageId}?workspaceId=${workspaces}&thumbnail=true`;
        
        // Create image source with authorization header
        // console.log(previewUrl)
        setImageSource({
          uri: previewUrl,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        // Optional: Verify the URL is accessible
        const response = await fetch(previewUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
       
        if (!response.ok) {
          throw new Error(`Failed to load image: ${response.status}`);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError('Failed to load image');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imageId, accessToken]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>

 
    <View style={styles.container}>
     

        <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()}  title={'Images Viewer'}/>
     
        {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading image...</Text>
        </View>
      ) : 
      !!imageSource ? (
        <Image
        
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          onError={(error) => {
            console.error('Image loading error:', error.nativeEvent.error);
            setError('Failed to load image');
          }}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No image available</Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  padding:15
   
  },
  image: {
    width: '100%',
    // height:600,
    resizeMode:'contain',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ImageViewer;

