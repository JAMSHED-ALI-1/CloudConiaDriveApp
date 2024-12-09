import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import { useSelector } from 'react-redux';

import CustomHeader from '../../components/CustomHeader';
import { baseURL } from '../../utils/constant/settings';
import { AppSettings } from '../../utils/Settings';

const AudioPreview = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const audioId = filePath?.id;

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [previewToken, setPreviewToken] = useState('');
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workspaces = useSelector(state => state.workspace.workspace);
  const progressInterval = useRef(null);

  // Fetch preview token
  useEffect(() => {
    const fetchPreviewToken = async () => {
      if (!accesstoken || !audioId) return;

      try {
        setLoading(true);
        const response = await axios.post(
          `${baseURL}/file-entries/${audioId}/add-preview-token`, 
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
        
        setPreviewToken(response.data.preview_token);
      } catch (error) {
        console.error('Error fetching preview token:', error);
        setError('Failed to load preview token');
        Alert.alert(
          'Error',
          'Failed to load the audio. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewToken();
  }, [accesstoken, audioId, workspaces]);

  // Initialize audio when preview token is available
  useEffect(() => {
    if (!previewToken) return;

    const audioUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
    
    const newSound = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.error('Error loading sound:', error);
        showFormatError();
        return;
      }

      setSound(newSound);
      setDuration(newSound.getDuration());
    });

    // Cleanup function
    return () => {
      if (newSound) {
        newSound.release();
      }
    };
  }, [previewToken, filePath]);

  // Show format error alert
  const showFormatError = useCallback(() => {
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
  }, [navigation]);

  // Progress tracking
  const startProgressTracking = useCallback(() => {
    progressInterval.current = setInterval(() => {
      if (sound) {
        sound.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }
    }, 100);
  }, [sound]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, []);

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
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
  }, [sound, isPlaying, startProgressTracking, stopProgressTracking]);

  // Slider change handler
  const onSliderChange = useCallback((value) => {
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
    }
  }, [sound]);

  // Time formatting utility
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
      <CustomHeader 
        back={true} 
        left={true} 
        OnPress={() => navigation.goBack()} 
        title={'Audio Play'} 
      />

      {/* Audio Visualization */}
      <View style={styles.visualizerContainer}>
        <Icon name="audiotrack" size={100} color="#4A90E2" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AudioPreview;