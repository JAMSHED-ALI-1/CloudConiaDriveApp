import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from './src/utils/Colors';
import CustomHeader from './src/components/CustomHeader';
import { WebView } from 'react-native-webview';

const Test = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const accessToken = user?.access_token;
  const pptId = filePath?.id;
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pptId || !accessToken) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        const previewUrl = `https://drive.coniacloud.com/api/v1/file-entries/${pptId}?workspaceId=0&thumbnail=true`;
        setImageSource({
          uri: previewUrl,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Verify URL accessibility
        const response = await fetch(previewUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status}`);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [pptId, accessToken]);

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('An error occurred while loading the content.');
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (loading || !imageSource) {
    return renderLoader();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader
          back={true}
          left={true}
          OnPress={() => navigation.goBack()}
          title="PPT Viewer"
        />
        <WebView
          source={imageSource}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={renderLoader}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={handleWebViewError}
          onHttpError={handleWebViewError}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 15,
  },
  webview: {
    flex: 1,
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
});

export default Test;
