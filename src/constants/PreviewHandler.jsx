import React from 'react';
import { useNavigation } from '@react-navigation/native';

const PreviewHandler = ({ item, setIsFolderChanging, setFolderHistory, setLocalData, handleFilePreview, user }) => {
  const navigation = useNavigation();

  const handlePreview = () => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const videoExtensions = ['mp4', 'avi', 'mkv', 'mov', 'wmv'];
    const audioExtensions = ['mp3', 'wav', 'aac', 'flac'];
    const documentExtensions = ['doc', 'docx'];
    const pptExtensions = ['pptx', 'ppt', 'odp'];
    const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods'];
    const textExtensions = ['txt'];
    const compressedExtensions = ['zip', 'tar', 'rar', 'exe', 'app', 'apk'];

    const extension = item.extension.toLowerCase();

    // Check file type and navigate accordingly
    if (imageExtensions.includes(extension)) {
      navigation.navigate('ImageViewer', { filePath: item, user });
    } else if (item.type === 'pdf') {
      navigation.navigate('PdfView', { filePath: item, user });
    } else if (videoExtensions.includes(extension)) {
      navigation.navigate('VideoPreview', { filePath: item, user });
    } else if (audioExtensions.includes(extension)) {
      navigation.navigate('AudioPreview', { filePath: item, user });
    } else if (documentExtensions.includes(extension)) {
      navigation.navigate('WordPreview', { filePath: item, user });
    } else if (pptExtensions.includes(extension)) {
      navigation.navigate('PptPreview', { filePath: item, user });
    } else if (spreadsheetExtensions.includes(extension)) {
      navigation.navigate('SpreadsheetPreview', { filePath: item, user });
    } else if (textExtensions.includes(extension)) {
      navigation.navigate('TextFilePreview', { filePath: item, user });
    } else if (compressedExtensions.includes(extension)) {
      navigation.navigate('Zipapkpreview', { filePath: item, user });
    } else {
      console.log('Unsupported file type');
    }
  };

  const handleFolderNavigation = () => {
    if (item.type === 'folder') {
      setIsFolderChanging(true); // Set loading state before navigating to a folder
      setFolderHistory((prevHistory) => [...prevHistory, item.id]); // Navigate into the folder by adding it to the history stack
      setLocalData([]); // Clear local data for faster UI transition
    } else {
      handlePreview(); // Handle file preview if the item is not a folder
    }
  };

  return {
    handlePreview,
    handleFolderNavigation,
  };
};

export default PreviewHandler;
