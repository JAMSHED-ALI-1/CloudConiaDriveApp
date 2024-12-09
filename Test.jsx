import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';


const Test = () => {
  const videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        onError={(e) => console.error('Video Error:', e)}
        onPlaybackStatusUpdate={(status) => console.log('Playback Status:', status)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
});

export default Test;
