// import React, { useCallback, useEffect, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector } from 'react-redux';
// import { useGetFileFolderQuery } from './src/redux/reducers/services/filefolderApi';
// import MediaPreview from './src/screens/preview/PreviewModal';
// import { COLORS } from './src/utils/Colors';
// import FileFolderModal from './src/Modaals/FileFolderModal';
// import FileItem from './src/components/RenderCardListGrid';

// const Test = ({ navigation }) => {
//   const [grid, setGrid] = useState(false);
//   const [folderStack, setFolderStack] = useState([{ id: 0, name: 'All Files' }]);
//   const user = useSelector((state) => state.auth.user);
//   const workspaces = useSelector(state => state.workspace.workspace);
//   const [opencreateuplodModal, setopencreateModal] = useState(false);
//   const [localData, setLocalData] = useState([]);
//   const [isFolderChanging, setIsFolderChanging] = useState(false);
//   const [sortingInfo, setSortingInfo] = useState({
//     sortBy: 'updated_at',
//     sortDir: 'desc',
//   });
//   const [isFolderLoading, setIsFolderLoading] = useState(false); // New state for folder loading

//   const currentFolderId = folderStack[folderStack.length - 1].id;
//   const [previewFile, setPreviewFile] = useState(null);

//   const handlecreateOpenModal = () => {
//     setopencreateModal(true);
//   };

//   const handleclosecreatefolderFileModal = () => {
//     setopencreateModal(false);
//   };

//   const handleFolderCreationSuccess = () => {
//     refetch();
//   };

//   const params = {
//     pageId: 0,
//     folderId: currentFolderId,
//     page: 1,
//     workspaceId: workspaces || 0,
//     deletedOnly: false,
//     starredOnly: false,
//     recentOnly: false,
//     sharedOnly: false,
//     per_page: 100,
//     orderBy: sortingInfo.sortBy,
//     orderDir: sortingInfo.sortDir,
//   };

//   const handleMediaPreview = useCallback((item) => {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
//     if (item.type === 'folder') {
//       // setIsFolderLoading(true); // Set loading state to true
//       // setIsFolderChanging(true);
//       setFolderStack((prevStack) => [...prevStack, { id: item.id, name: item.name }]);
//       refetch(); 
//     } else if (imageExtensions.includes(item.extension.toLowerCase())) {
//       setPreviewFile(item);
//     } else if (item.type === 'pdf') {
//       navigation.navigate('PdfView', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)) {
//       navigation.navigate('VideoPreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)) {
//       navigation.navigate('AudioPreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['doc', 'docx'].includes(item.extension)) {
//       navigation.navigate('WordPreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['pptx', 'ppt', 'odp'].includes(item.extension)) {
//       navigation.navigate('PptPreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['xls', 'xlsx', 'csv', 'ods'].includes(item.extension)) {
//       navigation.navigate('SpreadsheetPreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['txt'].includes(item.extension)) {
//       navigation.navigate('TextFilePreview', {
//         filePath: item,
//         user: user,
//       });
//     } else if (['zip', 'tar', 'rar', 'exe', 'app', 'apk'].includes(item.extension)) {
//       navigation.navigate('Zipapkpreview', {
//         filePath: item,
//         user: user,
//       });
//     } else {
//       console.log('File clicked:');
//     }
//   }, [navigation, user, folderStack]);

 

//   const { 
//     data: fileResponse = { data: [] }, 
//     isLoading, 
//     error,
//     refetch,
//   } = useGetFileFolderQuery(params);

//   const toggleView = () => setGrid(!grid);

//   const handleGoBack = () => {
//     if (folderStack.length > 1) {
//       setFolderStack(folderStack.slice(0, -1));
//     }
//   };

//   const renderItem = useCallback(({ item }) => (
//     <FileItem
//       item={item}
//       grid={grid}
//       handleMediaPreview={handleMediaPreview}
//     />
//   ), [grid, handleMediaPreview]);

//   if (isLoading || isFolderLoading) { // Show loading indicator for both initial load and folder navigation
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Failed to load files or backend Issue?</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.breadcrumbContainer}>
//         {folderStack.length > 1 && (
//           <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="#007BFF" />
//           </TouchableOpacity>
//         )}
       
//         <View style={styles.toggleContainer}>
//           <TouchableOpacity
//             style={[styles.toggleButton, !grid && styles.toggleButtonActive]}
//             onPress={toggleView}
//           >
//             <Icon name="list" size={20} color={!grid ? '#fff' : '#007BFF'} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.toggleButton, grid && styles.toggleButtonActive]}
//             onPress={toggleView}
//           >
//             <Icon name="grid" size={20} color={grid ? '#fff' : '#007BFF'} />
//           </TouchableOpacity>
//         </View>
//       </View>
//       {isFolderLoading ? (
//         <ActivityIndicator size="large" color={COLORS.blue} />
//       ) : (
//         <FlatList
//           data={fileResponse.data}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           key={grid ? 'grid' : 'list'}
//           numColumns={grid ? 2 : 1}
//           ListEmptyComponent={() => (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No files found</Text>
//             </View>
//           )}
//         />
//       )}
//       <TouchableOpacity style={{...styles.buttoncontainer}} onPress={handlecreateOpenModal}>
//         <Text style={styles.text}>+</Text>
//       </TouchableOpacity>
//       <MediaPreview 
//         visible={!!previewFile}
//         fileUri={previewFile} 
//         fileType={previewFile?.type}
//         onClose={() => setPreviewFile(null)}
//       />
//       <FileFolderModal
//         visible={opencreateuplodModal}
//         user={user}
//         folderId={currentFolderId} 
//         onClose={handleclosecreatefolderFileModal}
//         onSuccess={handleFolderCreationSuccess}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   breadcrumbContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   breadcrumbText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//   },
//   toggleButton: {
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     marginLeft: 8,
//   },
//   toggleButtonActive: {
//     backgroundColor: '#007BFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     color: '#777',
//     fontSize: 16,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 40,
//   },
//   buttoncontainer: {
//     height: 70,
//     width: 70,
//     backgroundColor: COLORS.blue,
//     borderRadius: 50,
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default Test;






import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetFileFolderQuery } from './src/redux/reducers/filefolder';
import { COLORS } from './src/utils/Colors';
import FileItem from './src/components/RenderCardListGrid';
import Icon from 'react-native-vector-icons/Ionicons';
import FileFolderModal from './src/Modaals/FileFolderModal';

const Test = ({navigation}) => {
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspace.workspace);
  const [grid, setGrid] = useState(false);
  const [folderHistory, setFolderHistory] = useState([0]);
  const [opencreateuplodModal, setopencreateModal] = useState(false);
  const [sortingInfo, setSortingInfo] = useState({
    sortBy: 'updated_at',
    sortDir: 'desc',
  });
  const currentFolderId =  folderHistory[folderHistory.length - 1];
  const [localData, setLocalData] = useState([]);
  const [isFolderChanging, setIsFolderChanging] = useState(false);

  const toggleView = () => setGrid(!grid);

  const params = {
    pageId: 0,
    folderId: folderHistory[folderHistory.length - 1],
    page: 1,
    workspaceId: workspaces || 0,
    deletedOnly: false,
    starredOnly: false,
    recentOnly: false,
    sharedOnly: false,
    per_page: 100,
    orderBy: sortingInfo.sortBy,
    orderDir: sortingInfo.sortDir,
  };

  const { data, error, isLoading, refetch } = useGetFileFolderQuery(params);

  useEffect(() => {
    // console.log('Data updated:', data);/
    if (data?.data) {
      setLocalData(data.data);
      setIsFolderChanging(false);
    }
  }, [data]);
  
  const handleFolderCreationSuccess = useCallback(() => {
    refetch();
  }, [refetch]);
  // Add error handling


  const handleMediaPreview = useCallback((item) => {
    if (item.type === 'folder') {
      setIsFolderChanging(true);
      setFolderHistory(prev => [...prev, item.id]);
      // Don't clear localData to prevent flickering
    } else {
      const extension = item.extension?.toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
        navigation.navigate('ImageViewer', { filePath: item, user });
      } else if (item.type === 'pdf') {
        navigation.navigate('PdfView', { filePath: item, user });
      } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(extension)) {
        navigation.navigate('VideoPreview', { filePath: item, user });
      } else if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) {
        navigation.navigate('AudioPreview', { filePath: item, user });
      } else if (['doc', 'docx'].includes(extension)) {
        navigation.navigate('WordPreview', { filePath: item, user });
      } else if (['pptx', 'ppt', 'odp'].includes(extension)) {
        navigation.navigate('PptPreview', { filePath: item, user });
      } else if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
        navigation.navigate('SpreadsheetPreview', { filePath: item, user });
      } else if (extension === 'txt') {
        navigation.navigate('TextFilePreview', { filePath: item, user });
      } else if (['zip', 'tar', 'rar', 'exe', 'app', 'apk'].includes(extension)) {
        navigation.navigate('Zipapkpreview', { filePath: item, user });
      } else {
        Alert.alert('Unsupported File', 'This file type cannot be previewed.');
      }
    }
  }, [navigation, user]);

  const handlecreateOpenModal = () => setopencreateModal(true);
  const handleclosecreatefolderFileModal = () => setopencreateModal(false);
  
  

  const goBack = useCallback(() => {
    if (folderHistory.length > 1) {
      setIsFolderChanging(true);
      setFolderHistory(prev => {
        const newHistory = [...prev];
        newHistory.pop();
        return newHistory;
      });
    }
  }, [folderHistory.length]);

  const renderItem = useCallback(({ item }) => (
    <FileItem
      item={item}
      grid={grid}
      handleMediaPreview={() => handleMediaPreview(item)}
    />
  ), [grid, handleMediaPreview]);

  // Empty state component
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="folder-open-outline" size={50} color={COLORS.gray} />
      <Text style={styles.emptyText}>This folder is empty</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {folderHistory.length > 1 ? (
          <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
            <Icon name="arrow-back" size={24} color={COLORS.blue} />
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, !grid && styles.toggleButtonActive]}
            onPress={toggleView}
          >
            <Icon name="list" size={20} color={!grid ? '#fff' : '#007BFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, grid && styles.toggleButtonActive]}
            onPress={toggleView}
          >
            <Icon name="grid" size={20} color={grid ? '#fff' : '#007BFF'} />
          </TouchableOpacity>
        </View>
      </View>

      {isFolderChanging || isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          key={grid ? 'grid' : 'list'}
          numColumns={grid ? 2 : 1}
          onRefresh={refetch}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity 
        style={styles.buttoncontainer}
        onPress={handlecreateOpenModal}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <FileFolderModal
  visible={opencreateuplodModal}
  onClose={handleclosecreatefolderFileModal}
  onSuccess={handleFolderCreationSuccess}
  user={user}
  folderId={folderHistory[folderHistory.length - 1]}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  goBackText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.blue,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#007BFF',
  },
  buttoncontainer: {
    height: 70,
    width: 70,
    backgroundColor: COLORS.blue,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 30,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 90,
  },
});

export default Test;




