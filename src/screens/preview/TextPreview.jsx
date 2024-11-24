import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AppSettings } from '../../utils/Settings';
import { makeApiCall } from '../../helper/apiHelper';

import CustomHeader from '../../components/CustomHeader';

const TextFilePreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const textFileId = filePath.id;
  const [previewToken, setPreviewToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const accessToken = user?.access_token;

  useEffect(() => {
    const fetchTextFileData = async () => {
      try {
        // Fetch the preview token
        const tokenResponse = await makeApiCall(
          `/api/v1/file-entries/${textFileId}/add-preview-token`,
          accessToken,
          'post',
          {}
        );
        const token = tokenResponse?.preview_token;
        setPreviewToken(token);

        // Construct the text file URL using the preview token
        const textFileUrl = `${AppSettings.base_url}${filePath.url}?preview_token=${token}`;

        // Fetch the actual file content
        const response = await fetch(textFileUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        const content = await response.text();
        setFileContent(content.trim()); // Trim to handle whitespace-only responses
      } catch (error) {
        console.error('Error loading text file:', error);
        setError('Failed to load text file content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTextFileData();
  }, [textFileId, accessToken, filePath.url]);

  return (
    <View style={styles.container}>
      <CustomHeader back={true} left={true} OnPress={() => navigation.goBack()} />
      <View style={styles.textContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : fileContent ? (
          <ScrollView>
            <Text style={styles.fileContent}>{fileContent}</Text>
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>No Data Available</Text>
        )}
      </View>
    </View>
  );
};

export default TextFilePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
