import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';

import CustomHeader from '../../components/CustomHeader';
import { baseURL } from '../../utils/constant/settings';
import { AppSettings } from '../../utils/Settings';
import { COLORS } from '../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';

const VideoPreview = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const fileId = filePath?.id;
console.log(filePath?.name.slice(0,20)+'...','apna Path')
  // State variables
  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [webViewLoading, setWebViewLoading] = useState(false);

  // Combine both loading states
  const isLoading = loading || webViewLoading;


  // References


  // Redux workspace selector
  const workspaces = useSelector(state => state.workspace.workspace);

  // Fetch preview token
  useEffect(() => {
    const fetchPreviewToken = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${baseURL}/file-entries/${fileId}/add-preview-token`, 
          {},
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              'Content-Type': 'application/json',
            },
            params: {
              workspaceId: workspaces || 0,
            }
          }
        );
        
        const token = response?.data?.preview_token;
        setPreviewToken(token);
        
        // Construct video URL with preview token
        const constructedFileUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${token}`;
        setFileUrl(constructedFileUrl);
      } catch (error) {
        console.error('Error fetching preview token:', error);
        if (error.response && error.response.status === 403) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again.',
            [
              {
                text: 'OK',
                onPress: () => navigation.replace('Login')
              }
            ]
          );
        } else {
          setError('Failed to load video. Please try again later.');
          Alert.alert(
            'Error',
            'Failed to load the video. Please try again later.'
          );
        }
        setError('Failed to load video. Please try again later.');
        Alert.alert(
          'Error',
          'Failed to load the video. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewToken();
  }, [accesstoken, fileId, workspaces]);

  // Time formatting utility
 
  // Toggle play/pause

  // Handle video load
 
  const isAndroid = Platform.OS === 'android';
  const supportedFormats = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'];
  const fileExtension = filePath?.extension?.toLowerCase();
  const googleDocsViewer = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;
  const finalFileUrl = isAndroid && supportedFormats.includes(fileExtension) ? googleDocsViewer : fileUrl;
  

  // Loading state
  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{color:COLORS.black}}>Loading...</Text>
  //     </View>
  //   );
  // }
  const Spinner = () => (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" color={COLORS.black} />
    </View>
);
  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
   <LinearGradient
   style={{ flex: 1 }}
   colors={['#2B65B0', '#6CA1E6', '#fbc2eb']} // Customize your gradient colors
   start={{ x: 0, y: 0 }}
   end={{ x: 1, y: 1 }}
   >

  
   
      <View style={{ padding: 10 }}>
        <CustomHeader 
          back={true} 
          left={true} 
          OnPress={() => navigation.goBack()} 
          title={filePath?.name.slice(0,13)+'...'+filePath.extension} 
        />
      </View>
     
{/*     
      <WebView
        source={{ uri: fileUrl }}
        style={styles.video}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        // allowsFullscreenVideo={true}
        // mediaPlaybackRequiresUserAction={false}
        onLoadStart={() => setWebViewLoading(true)}
        onLoadEnd={() => setWebViewLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error:', nativeEvent);
          setWebViewLoading(false);
        }}
        bounces={false}
        startInLoadingState={true}
        renderLoading={Spinner}
       
     
        showsHorizontalScrollIndicator={false}
        scalesPageToFit

        // onLoadProgress={true}
      /> */}
    {
      loading ? (
        <View style={styles.container}>
          <Text style={{ color: COLORS.black }}>Loading...</Text>
        </View>
      ) : (
   

    <WebView
  source={{ uri: finalFileUrl }}
  style={styles.video}
  allowsFullscreenVideo={true}
  mediaPlaybackRequiresUserAction={false}
  onLoadStart={() => setWebViewLoading(true)}
  onLoadEnd={() => setWebViewLoading(false)}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);
    setWebViewLoading(false);
  }}
  bounces={false}
  startInLoadingState={true}
  renderLoading={Spinner}
  showsHorizontalScrollIndicator={false}
  scalesPageToFit
  javaScriptEnabled={true}
  domStorageEnabled={true}
  setSupportMultipleWindows={false}
  originWhitelist={['*']}
  onShouldStartLoadWithRequest={(event) => {
    // Prevent downloading and force WebView to handle it
    if (event.url.startsWith('http') && !event.url.includes('download')) {
      return true;
    }
    return false;
  }}
/>)}

    <View style={styles.fileInfoContainer}>
      <Text style={styles.fileName}>{filePath?.name || 'File'}</Text>
    </View>
  </LinearGradient>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    alignItems:'center',
    justifyContent:'center'
  },
  videoContainer: {
    flex:1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  video: {
    width: '100%',
    height: '70%',
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    width:'100%'
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 40,
    
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  controlButton: {
    // width:'90%',
    padding: 10,
    marginHorizontal: 20,
  },
  fileInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.black,
    fontSize: 16,
  },
  activityContainer:{
    bottom:"50%"
  }
});

export default VideoPreview;