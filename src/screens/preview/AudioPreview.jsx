import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  // Slider,
  Alert,
  Platform
} from 'react-native';
import { makeApiCall } from '../../helper/apiHelper';
import { AppSettings } from '../../utils/Settings';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import CustomHeader from '../../components/CustomHeader';
const AudioPreview = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const audioId = filePath?.id;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sound, setSound] = useState(null);

  const progressInterval = useRef(null);

  useEffect(() => {
    // Initialize Sound
    Sound.setCategory('Playback');
    
    return () => {
      if (sound) {
        sound.release();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const showFormatError = () => {
    Alert.alert(
      'Unsupported Format',
      'This audio format is not supported for preview. Please try downloading the file instead.',
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
      if (!accesstoken || !audioId) {
        setError('Invalid audio credentials');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await makeApiCall(
          `/api/v1/file-entries/${audioId}/add-preview-token`,
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
  }, [accesstoken, audioId]);

  useEffect(() => {
    if (previewToken && filePath?.url) {
      try {
        const audioUri = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
        setAudioUrl(audioUri);
        initializeAudio(audioUri);
      } catch (error) {
        console.error('Error setting audio URL:', error);
        showFormatError();
      }
    }
  }, [previewToken, filePath]);

  const initializeAudio = (uri) => {
    const newSound = new Sound(uri, null, (error) => {
      if (error) {
        console.error('Error loading sound:', error);
        showFormatError();
        return;
      }

      setSound(newSound);
      setDuration(newSound.getDuration());
      setLoading(false);
    });
  };

  const startProgressTracking = () => {
    progressInterval.current = setInterval(() => {
      if (sound) {
        sound.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }
    }, 100);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause(() => {
        setIsPlaying(false);
        stopProgressTracking();
      });
    } else {
      sound.play((success) => {
        if (!success) {
          Alert.alert('Playback failed');
        }
        setIsPlaying(false);
        stopProgressTracking();
      });
      setIsPlaying(true);
      startProgressTracking();
    }
  };

  const onSliderChange = (value) => {
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
    }
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

  return (
    <View style={styles.container}>
      {/* Audio Visualization */}
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()}  title={'Audio Play'}/>
      <View style={styles.visualizerContainer}>
        <Icon 
          name="audiotrack" 
          size={100} 
          color="#4A90E2"
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
            style={styles.playButton}
            onPress={togglePlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={40} 
              color="#4A90E2"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* File Info */}
      <View style={styles.fileInfoContainer}>
        <Text style={styles.fileName}>{filePath?.name || 'Audio File'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  visualizerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
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
  playButton: {
    padding: 10,
  },
  fileInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  }
});

export default AudioPreview;
