import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';

const TextFilePreview = ({ route, navigation }) => {
  const { filePath, user } = route.params;
  const textFileId = filePath.id;
  const accessToken = user?.access_token;

  // States
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!textFileId || !accessToken) {
      setError('Missing required parameters');
      setIsLoading(false);
      return;
    }

    const fetchTextFile = async () => {
      try {
        const previewUrl = `https://drive.coniacloud.com/api/v1/file-entries/${textFileId}?workspaceId=0&thumbnail=`;
        
        const response = await fetch(previewUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status}`);
        }

        const text = await response.text(); // Assuming the API returns plain text
        setFileContent(text);
      } catch (err) {
        console.error('Error fetching text file:', err);
        setError('Failed to load file content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTextFile();
  }, [textFileId, accessToken]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaView>
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
