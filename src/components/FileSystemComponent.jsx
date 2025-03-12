import { useCallback } from 'react';
import { Alert } from 'react-native';

export const useMediaPreview = (navigation, user) => {
  const handleMediaPreview = useCallback((item) => {
    // If it's a folder, return the item for folder navigation logic
    if (item.type === 'folder') {
      return item;
    }

    const extension = item.extension?.toLowerCase();
    
    // Define preview routes based on file types
    const previewRoutes = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
      pdf: ['pdf'],
      video: ['mp4', 'avi', 'mkv', 'mov', 'wmv'],
      audio: ['mp3', 'wav', 'aac', 'flac'],
      word: ['doc', 'docx'],
      ppt: ['pptx', 'ppt', 'odp'],
      spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
      text: ['txt'],
      compressed: ['zip', 'tar', 'rar', 'exe', 'app', 'apk']
    };

    // Determine the navigation route based on file type
    let route = null;
    
    Object.entries(previewRoutes).forEach(([type, extensions]) => {
      if (extensions.includes(extension)) {
        switch(type) {
          case 'images':
            route = 'ImageViewer';
            break;
          case 'pdf':
            route = 'PdfView';
            break;
          case 'video':
            route = 'VideoPreview';
            break;
          case 'audio':
            route = 'AudioPreview';
            break;
          case 'word':
            route = 'WordPreview';
            break;
          case 'ppt':
            route = 'PptPreview';
            break;
          case 'spreadsheet':
            route = 'SpreadsheetPreview';
            break;
          case 'text':
            route = 'TextFilePreview';
            break;
          case 'compressed':
            route = 'Zipapkpreview';
            break;
        }
      }
    });

    // Navigate or show unsupported file alert
    if (route) {
      navigation.navigate(route, { filePath: item, user });
    } else {
      Alert.alert('Unsupported File', 'This file type cannot be previewed.');
    }

    return null;
  }, [navigation, user]);

  return handleMediaPreview;
};