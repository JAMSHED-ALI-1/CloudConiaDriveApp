import React, { useCallback, useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import CustomHeader from '../../components/CustomHeader';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AppSettings } from '../../utils/Settings';
import { baseURL } from '../../utils/constant/settings';
import CustomButton from '../../components/CustomButton';

const PdfView = ({ route, navigation }) => {
  const { user, filePath } = route.params;
  const accesstoken = user?.access_token;
  const PdfId = filePath?.id;
  const truncatedName = filePath?.name.length > 12 
    ? filePath?.name.slice(0, 12) + "..." 
    : filePath?.name;

  const [previewToken, setPreviewToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workspaces = useSelector(state => state.workspace.workspace);

  // Fetch the preview token
  useEffect(() => {
    const fetchPreviewToken = async () => {
      if (!accesstoken || !PdfId) return;

      try {
        setLoading(true);
        const response = await axios.post(
          `${baseURL}/file-entries/${PdfId}/add-preview-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              'Content-Type': 'application/json',
            },
            params: {
              workspaceId: workspaces || 0,
            },
          }
        );

        setPreviewToken(response.data.preview_token);
      } catch (error) {
        console.error('Error fetching preview token:', error);
        setError('Failed to load preview token');
        Alert.alert(
          'Error',
          'Failed to load the PDF. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewToken();
  }, [accesstoken, PdfId, workspaces]);

  // Get the preview URL
  const getPreviewUrl = useCallback(() => {
    if (!previewToken || !filePath?.url) {
      return null;
    }

    return `${AppSettings.base_url}${filePath.url}?preview_token=${previewToken}`;
  }, [previewToken, filePath]);

  // Open the PDF
  const openPDF = async () => {
    const pdfUrl = getPreviewUrl();
    if (!pdfUrl) {
      Alert.alert('Error', 'Unable to fetch the PDF URL');
      setLoading(false);
      return;
    }

    const localPath = `${RNFS.DocumentDirectoryPath}/${truncatedName}.pdf`;
   
    try {
      setLoading(true);

      const download = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: localPath,
      }).promise;

      if (download.statusCode === 200) {
        setLoading(false);
       
        await FileViewer.open(localPath);
      } else {
        setLoading(false);
        Alert.alert('Error', 'Failed to download the PDF.');
        console.error('Download failed.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to open the PDF.');
      console.error('Error opening PDF:', error);
    }
  };

  // useEffect(() => {
  //   if (!error && previewToken) {
  //     openPDF();
  //   }
  // }, [error, previewToken]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Mandatory Header */}
      <View style={{flex:1,padding:15}}>

    
      <CustomHeader
        back={true}
        left={true}
        OnPress={() => navigation.goBack()}
        title={'PDF Viewer'}
      />

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <View style={{width:'70%'}}>

        
        <CustomButton  buttonTitle={'Open Pdf'} onPress={openPDF}/>
        </View>
        {loading && (
          <ActivityIndicator 
            size="large" 
            color="#0000ff" 
          />
        )}
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PdfView;