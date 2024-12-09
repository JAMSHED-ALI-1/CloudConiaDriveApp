import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
const navigation=useNavigation()
const HandleItemPress = useCallback((item,) => {
  if (item.type === 'folder') {
    setCurrentFolder((prevState) => ({
      pageId: item.hash, // Dynamically use folder's hash as pageId
      folderId: item.hash,
      folderDetails: item,
      breadcrumbs: [...prevState.breadcrumbs, item],
    }));
  } else {
    const extensionToRouteMap = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
      pdf: ['pdf'],
      videos: ['mp4', 'avi', 'mkv', 'mov', 'wmv'],
      audio: ['mp3', 'wav', 'aac', 'flac'],
      word: ['doc', 'docx'],
      powerpoint: ['ppt', 'pptx', 'odp'],
      spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
      text: ['txt'],
      archives: ['zip', 'tar', 'rar', 'exe', 'app', 'apk'],
    };

    const routeMap = {
      images: 'ImageViewer',
      pdf: 'PdfView',
      videos: 'VideoPreview',
      audio: 'AudioPreview',
      word: 'WordPreview',
      powerpoint: 'PptPreview',
      spreadsheet: 'SpreadsheetPreview',
      text: 'TextFilePreview',
      archives: 'Zipapkpreview',
    };

    const extension = item.extension?.toLowerCase();
    const routeKey = Object.keys(extensionToRouteMap).find((key) =>
      extensionToRouteMap[key].includes(extension)
    );

    if (routeKey && routeMap[routeKey]) {
      navigation.navigate(routeMap[routeKey], {
        filePath: item,
        user: user,
      });
    } else {
      console.warn('Unsupported file type clicked:', item);
    }
  }
}, [navigation, user, folderStack]);
