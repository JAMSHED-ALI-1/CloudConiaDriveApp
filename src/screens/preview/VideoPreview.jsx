import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Alert,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Video from 'react-native-video';
import { makeApiCall } from '../../helper/apiHelper';
import { AppSettings } from '../../utils/Settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/CustomHeader';
import { COLORS } from '../../utils/Colors';

const VideoPreview = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const videoId = filePath?.id;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(1.0); // Add volume state
  const [muted, setMuted] = useState(false); // Add muted state

  const showFormatError = () => {
    Alert.alert(
      'Unsupported Format',
      'This video format is not supported for preview. Please try downloading the file instead.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  useEffect(() => {
    const fetchPreviewToken = async () => {
      if (!accesstoken || !videoId) {
        setError('Invalid video credentials');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await makeApiCall(
          `/api/v1/file-entries/${videoId}/add-preview-token`,
          accesstoken,
          'post'
        );

        if (!response?.preview_token) {
          throw new Error('Preview token not received');
        }

        setPreviewToken(response.preview_token);
      } catch (error) {
        console.error('Error fetching preview token:', error);
        setError('Failed to load preview token');
        showFormatError();
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewToken();
  }, [accesstoken, videoId]);

  useEffect(() => {
    if (previewToken && filePath?.url) {
      try {
        const videoUri = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
        setVideoUrl(videoUri);
        setPaused(false);
      } catch (error) {
        console.error('Error setting video URL:', error);
        showFormatError();
      }
    }
  }, [previewToken, filePath]);

  const onLoadStart = () => {
    setIsBuffering(true);
  };

  const onLoad = (data) => {
    setIsBuffering(false);
    setDuration(data.duration);
    setLoading(false);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onError = (error) => {
    console.error('Video playback error:', error);
    showFormatError();
  };

  const onBuffer = ({ isBuffering }) => {
    setIsBuffering(isBuffering);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (loading) {
    return renderLoader();
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!videoUrl) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid video URL</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.backgroundColor}}>
      <View style={styles.container}>
        <CustomHeader 
          back={true} 
          left={true} 
          OnPress={() => navigation.goBack()} 
          title={'Video Play'} 
          bgColor={'white'}
        />
        
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode="contain"
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onError}
          onBuffer={onBuffer}
          paused={paused}
          volume={volume}
          muted={muted}
          audioOnly={false}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch={'ignore'} // Important for iOS audio
          controls={false}
        />

        {/* Custom Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
            <Icon 
              name={paused ? 'play-arrow' : 'pause'} 
              size={40} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
            <Icon 
              name={muted ? 'volume-off' : 'volume-up'} 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </View>

        {isBuffering && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  bufferingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  controlButton: {
    padding: 10,
  },
  timeContainer: {
    flex: 1,
    marginLeft: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  }
});

export default VideoPreview;