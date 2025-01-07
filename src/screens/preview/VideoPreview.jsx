// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   ActivityIndicator,
//   Platform,
//   Alert,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   SafeAreaView
// } from 'react-native';
// import Video from 'react-native-video';
// import { makeApiCall } from '../../helper/apiHelper';
// import { AppSettings } from '../../utils/Settings';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import CustomHeader from '../../components/CustomHeader';
// import { COLORS } from '../../utils/Colors';

// const VideoPreview = ({ route, navigation }) => {
//   const { user, filePath } = route.params;
//   const accesstoken = user?.access_token;
//   const videoId = filePath?.id;

//   const [previewToken, setPreviewToken] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [paused, setPaused] = useState(true);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [volume, setVolume] = useState(1.0); // Add volume state
//   const [muted, setMuted] = useState(false); // Add muted state

//   const showFormatError = () => {
//     Alert.alert(
//       'Unsupported Format',
//       'This video format is not supported for preview. Please try downloading the file instead.',
//       [
//         {
//           text: 'OK',
//           onPress: () => navigation.goBack()
//         }
//       ]
//     );
//   };

//   useEffect(() => {
//     const fetchPreviewToken = async () => {
//       if (!accesstoken || !videoId) {
//         setError('Invalid video credentials');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await makeApiCall(
//           `/api/v1/file-entries/${videoId}/add-preview-token`,
//           accesstoken,
//           'post'
//         );

//         if (!response?.preview_token) {
//           throw new Error('Preview token not received');
//         }

//         setPreviewToken(response.preview_token);
//       } catch (error) {
//         console.error('Error fetching preview token:', error);
//         setError('Failed to load preview token');
//         showFormatError();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPreviewToken();
//   }, [accesstoken, videoId]);

//   useEffect(() => {
//     if (previewToken && filePath?.url) {
//       try {
//         const videoUri = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
//         setVideoUrl(videoUri);
//         setPaused(false);
//       } catch (error) {
//         console.error('Error setting video URL:', error);
//         showFormatError();
//       }
//     }
//   }, [previewToken, filePath]);

//   const onLoadStart = () => {
//     setIsBuffering(true);
//     // console.log(`Muted: ${muted}, Volume: ${volume}`);

//   };

//   const onLoad = (data) => {
//     setIsBuffering(false);
//     setDuration(data.duration);
//     setLoading(false);
//   };

//   const onProgress = (data) => {
//     setCurrentTime(data.currentTime);
//   };

//   const onError = (error) => {
//     console.error('Video playback error:', error);
//     showFormatError();
//   };

//   const onBuffer = ({ isBuffering }) => {
//     setIsBuffering(isBuffering);
//   };

//   const togglePlayPause = () => {
//     setPaused(!paused);
//   };

//   const toggleMute = () => {
//     setMuted(!muted);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     seconds = Math.floor(seconds % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const renderLoader = () => (
//     <View style={styles.loaderContainer}>
//       <ActivityIndicator size="large" color="#0000ff" />
//     </View>
//   );

//   if (loading) {
//     return renderLoader();
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   if (!videoUrl) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Invalid video URL</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={{flex:1, backgroundColor:COLORS.backgroundColor}}>
//       <View style={styles.container}>
//         <View style={{}}>

      
//         <CustomHeader 
//           back={true} 
//           left={true} 
//           OnPress={() => navigation.goBack()} 
//           title={'Video Play'} 
//           bgColor={'white'}
//         />
//           </View>
//         <Video
//           source={{ uri: videoUrl }}
//           style={styles.video}
//           resizeMode="contain"
//           onLoadStart={onLoadStart}
//           onLoad={onLoad}
//           onProgress={onProgress}
//           onError={onError}
//           onBuffer={onBuffer}
//           paused={paused}
//           volume={volume}
//           muted={muted}
//           audioOnly={false}
//           playInBackground={false}
//           playWhenInactive={false}
//           ignoreSilentSwitch={'ignore'} // Important for iOS audio
//           controls={false}
//         />

//         {/* Custom Controls */}
//         <View style={styles.controls}>
//           <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
//             <Icon 
//               name={paused ? 'play-arrow' : 'pause'} 
//               size={40} 
//               color="white" 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
//             <Icon 
//               name={muted ? 'volume-off' : 'volume-up'} 
//               size={30} 
//               color="white" 
//             />
//           </TouchableOpacity>

//           <View style={styles.timeContainer}>
//             <Text style={styles.timeText}>
//               {formatTime(currentTime)} / {formatTime(duration)}
//             </Text>
//           </View>
//         </View>

//         {isBuffering && (
//           <View style={styles.bufferingContainer}>
//             <ActivityIndicator size="large" color="#0000ff" />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   video: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#000',
//   },
//   errorText: {
//     color: 'red',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   bufferingContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   controlButton: {
//     padding: 10,
//   },
//   timeContainer: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   timeText: {
//     color: 'white',
//     fontSize: 14,
//   }
// });

// export default VideoPreview;




import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useSelector } from 'react-redux';

import CustomHeader from '../../components/CustomHeader';
import { baseURL } from '../../utils/constant/settings';
import { AppSettings } from '../../utils/Settings';
import { COLORS } from '../../utils/Colors';

const VideoPreview = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const videoId = filePath?.id;
// console.log('vedioInfo--',route.params)
  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  // References
  const videoRef = useRef(null);

  // Redux workspace selector
  const workspaces = useSelector(state => state.workspace.workspace);
  

  // Fetch preview token
  useEffect(() => {
    const fetchPreviewToken = async () => {
      if (!accesstoken || !videoId) return;

      try {
        setLoading(true);
        const response = await axios.post(
          `${baseURL}/file-entries/${videoId}/add-preview-token`, 
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
        
        const token = response.data.preview_token;
        setPreviewToken(token);
        console.log(response.data)
        
        // Construct video URL with preview token
        const constructedVideoUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${token}`;
        setVideoUrl(constructedVideoUrl);
        console.log('url--',constructedVideoUrl)
      } catch (error) {
        console.error('Error fetching preview token:', error);
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
  }, [accesstoken, videoId, workspaces]);

  // Time formatting utility
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      setIsPlaying(!isPlaying);
      setShouldPlay(true);  // Explicitly set play intent
    }
  };

  // Handle video load
  const onLoad = (data) => {
    console.log('Video Fully Loaded');
    setDuration(data.duration);
    if (shouldPlay) {
      setIsPlaying(true);
    }
  };

  // Handle progress
  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  // Slider change handler
  const onSliderChange = (value) => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Video end handler
  const onEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>

  
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={{padding:10}}>
      <CustomHeader 
        back={true} 
        left={true} 
        OnPress={() => navigation.goBack()} 
        title={'Video Preview'} 
      />
      </View>
     

      {/* Video Player */}
      <View style={[
        styles.videoContainer, 
        isFullScreen && styles.fullScreenVideo
      ]}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          // source={{
          //    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          //   //  uri:'https://drive.coniacloud.com/api/v1/file-entries/18756?preview_token=npHy8LxW3fcb3GE'
          //   // uri:'https://www.youtube.com/watch?v=UvF3dY488pU'
          // }}
          style={styles.video}
          controls={false}
          paused={!isPlaying || !shouldPlay}  
          onLoad={onLoad}
          onProgress={onProgress}
          onEnd={onEnd}
          resizeMode="contain"
          // Add these iOS-specific props
          ignoreSilentSwitch={'ignore'}
          playInBackground={false}
          playWhenInactive={false}
        />
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={onSliderChange}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#4A90E2"
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={40} 
              color="#4A90E2" 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleFullScreen}
          >
            <Icon 
              name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'} 
              size={40} 
              color="#4A90E2" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* File Info */}
      <View style={styles.fileInfoContainer}>
        <Text style={styles.fileName}>{filePath?.name || 'Video File'}</Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  videoContainer: {
   flex:1,
    backgroundColor: '#000',
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
    height: '100%',
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
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
});

export default VideoPreview;