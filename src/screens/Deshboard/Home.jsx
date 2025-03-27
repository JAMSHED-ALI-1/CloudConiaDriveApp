// import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
// import React, { useCallback, useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { makeApihandler } from '../../helper/apiHelper';
// import { handleLogout } from '../../helper/Logouthelper';
// import strings from '../../helper/Language/LocalizedStrings';
// import { useMediaPreview } from '../../components/FileSystemComponent';
// import FileItem from '../../components/RenderCardListGrid';

// const Home = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const workspaces = 0;
//   const sortingInfo = { sortBy: 'name', sortDir: 'asc' };
//   const [currentFolderId, setCurrentFolderId] = useState(null);
//   const [folderStack, setFolderStack] = useState([{ id: null, name: strings.MyFiles }]);
//   const [isGrid, setIsGrid] = useState(true);
//   const [driveData, setDriveData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [pagination, setPagination] = useState({});

//   const showMessageHandler = (message) => {
//     console.log(message);
//     // Implement your actual message handler here
//   };

//   const handleFetchData = async (folderId = currentFolderId) => {
//     console.log('Fetching data for folder ID:', folderId);
//     setIsLoading(true);

//     try {
//       // Based on your response format, this seems to be the correct endpoint
//       const endpoint = `api/v1/file-entries`;
//       console.log(`Making request to: ${endpoint} with parent_id: ${folderId}`);

//       const response = await makeApihandler(endpoint, 'GET', {
//         params: {
//           parent_id: folderId, // This is the key parameter for filtering by folder
//           workspaceId: workspaces || 0,
//           page: 1,
//           per_page: 100,
//           orderBy: sortingInfo.sortBy,
//           orderDir: sortingInfo.sortDir,
//         },
//       });

//       // Safely log response without causing errors
//       console.log('API Response received');

//       // Handle the pagination data structure from your API
//       if (response && response.pagination && response.pagination.data) {
//         console.log(`Retrieved ${response.pagination.data.length} items`);
//         setDriveData(response.pagination.data);
//         setPagination({
//           currentPage: response.pagination.current_page,
//           totalPages: response.pagination.last_page,
//           totalItems: response.pagination.total
//         });
//       } else {
//         console.error('Unexpected response format:', JSON.stringify(response).substring(0, 200));
//         setDriveData([]);
//       }
//     } catch (error) {
//       console.error('API Error:', error.message || error);

//       if (error.response && error.response.status === 403) {
//         showMessageHandler('Token expired, redirecting to login...');
//         await handleLogout(navigation, dispatch);
//       } else {
//         showMessageHandler('Something went wrong. Please try again later.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Initial data fetch when component mounts
//     handleFetchData();
//   }, []);

//   const handleMediaPreview = useMediaPreview(navigation);

//   const onItemPress = useCallback((item) => {
//     console.log('Item pressed:', item.name, 'Type:', item.type, 'ID:', item.id);

//     if (item.type === 'folder') {
//       // Handle folder navigation
//       console.log('Navigating to folder:', item.name, 'with ID:', item.id);

//       // Update current folder ID first
//       setCurrentFolderId(item.id);

//       // Update folder stack for navigation history
//       setFolderStack((prev) => [...prev, { id: item.id, name: item.name }]);

//       // Fetch data for the selected folder
//       handleFetchData(item.id);
//     } else {
//       // Handle file preview
//       console.log('Previewing file:', item.name);
//       handleMediaPreview(item);
//     }
//   }, [handleMediaPreview]);

//   const handleBackPress = useCallback(() => {
//     if (folderStack.length > 1) {
//       // Remove the current folder from the stack
//       const newStack = folderStack.slice(0, -1);
//       setFolderStack(newStack);

//       // Get the parent folder's ID
//       const parentFolderId = newStack[newStack.length - 1].id;
//       console.log('Navigating back to folder with ID:', parentFolderId);

//       // Update current folder ID
//       setCurrentFolderId(parentFolderId);

//       // Fetch data for the parent folder
//       handleFetchData(parentFolderId);
//     }
//   }, [folderStack]);

//   const renderItem = useCallback(
//     ({ item }) => (
//       <FileItem
//         item={item}
//         grid={isGrid}
//         handleMediaPreview={() => onItemPress(item)}
//       />
//     ),
//     [isGrid, onItemPress]
//   );

//   return (
//     <View style={styles.container}>
//       {/* Folder navigation breadcrumb */}
//       <View style={styles.pathContainer}>
//         {folderStack.length > 1 && (
//           <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
//             <Text style={styles.backButtonText}>
//               ← Back to {folderStack[folderStack.length - 2].name}
//             </Text>
//           </TouchableOpacity>
//         )}
//         <Text style={styles.currentFolderText}>
//           Current: {folderStack[folderStack.length - 1].name}
//         </Text>
//       </View>

//       {/* View toggle button */}
//       <TouchableOpacity
//         style={styles.toggleButton}
//         onPress={() => setIsGrid(!isGrid)}>
//         <Text style={styles.toggleButtonText}>
//           {isGrid ? 'Switch to List View' : 'Switch to Grid View'}
//         </Text>
//       </TouchableOpacity>

//       {/* File/folder list */}
//       <FlatList
//         data={driveData}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         numColumns={isGrid ? 2 : 1}
//         key={isGrid ? 'grid' : 'list'}
//         contentContainerStyle={styles.listContainer}
//         ListFooterComponent={() => (
//           pagination.totalItems > 0 && (
//             <Text style={styles.paginationText}>
//               Showing {driveData.length} of {pagination.totalItems} items
//             </Text>
//           )
//         )}
//         ListEmptyComponent={() => (
//           isLoading ? (
//             <View style={styles.loaderContainer}>
//               <ActivityIndicator size="large" color="#0000ff" />
//               <Text style={styles.loadingText}>Loading...</Text>
//             </View>
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>
//                 {folderStack.length > 1 ? 'This folder is empty.' : 'No files or folders found.'}
//               </Text>
//             </View>
//           )
//         )}
//       />
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   pathContainer: {
//     marginBottom: 10,
//   },
//   backButton: {
//     paddingVertical: 10,
//   },
//   backButtonText: {
//     color: 'blue',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   currentFolderText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   toggleButton: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   toggleButtonText: {
//     color: '#333',
//     fontWeight: '500',
//   },
//   paginationText: {
//     textAlign: 'center',
//     color: '#666',
//     padding: 10,
//   },
//   listContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 50,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: 'gray',
//     textAlign: 'center',
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {COLORS} from '../../utils/Colors';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {baseURL, fileColorCode} from '../../utils/constant/settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {getData, timeAgo} from '../../helper/functionHelper';
import ModalForUploadAndCreateFile from '../../Modaals/ModalForUpladAndCreateFile';
import {FastField} from 'formik';
import HomeHeader from '../../components/HomeHeader';
import AnimationModal from '../../Modaals/AnimationModal';
import ActionModal from '../../Modaals/ActionModal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar';
import strings from '../../helper/Language/LocalizedStrings';
import {makeApiCall} from '../../helper/apiHelper';
import getItemIcon from '../../constants/GetItemIcon';
import ShortingModal from '../../Modaals/ShortingModal';
import FileFolderModal from '../../Modaals/FileFolderModal';
import {accessData} from '../../utils/UserAccessData';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
import UpgradeButton from '../../components/UpgradeButton';
import WorkspaceModal from '../../Modaals/WorkspaceModal';
import FileItem from '../../components/RenderCardListGrid';
import EmptyComponent from '../../components/EmptyComponent';
import Gridlist from '../../constants/Gridlist';
import ImagepreviewModal from '../../Modaals/ImagepreviewModal';

const Home = () => {
  const user = useSelector(state => state.auth.user);
  const [hasAccess, setHasAccess] = useState(false);
  const language = useSelector(state => state.language.language);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [folderStack, setFolderStack] = useState([
    {id: null, name: strings.HOME},
  ]);
  const [allData, setAllData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showmodal, setShowmodal] = useState(false);
  const [showModalAi, setshowmodalAi] = useState(false);
  const [actionModal, setactionModal] = useState(false);
  const currentFolderId = folderStack[folderStack.length - 1].id;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDrodown, setshowdropdown] = useState(false);
  const [workspacemodal, setshowworkspacemodal] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [handleImageViewMidal,setImageViewModal]=useState(false)
  const [sortingInfo, setSortingInfo] = useState({
    sortBy: 'updated_at',
    sortDir: 'desc',
  });
  const [isSelectionModeEnabled, setIsSelectionModeEnabled] = useState(false);
  const [imageId,setImgaeid]=useState(0)
  const navigation = useNavigation();
  const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled) {
          setIsSelectionModeEnabled(false);
          return true;
        } else {
          Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => BackHandler.exitApp(), // Exit app if confirmed
              },
            ],
            {cancelable: false}, // Disable tapping outside the alert to dismiss
          );
          return true; // prevents default behavior (so the app doesn't exit immediately)
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [isSelectionModeEnabled]),
  );

  const sortByOptions = [
    {key: strings.Size, value: 'file_size'},
    {key: strings.Name, value: 'name'},
    {key: strings.LastModified, value: 'updated_at'},
    {key: strings.UploadDate, value: 'created_at'},
  ];
  // console.log('---',workspaces)
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`,
        {
          headers: {Authorization: `Bearer ${user?.access_token}`},
          params: {
            pageId: currentFolderId,
            folderId: currentFolderId,
            page: 1,
            workspaceId: workspaces ? workspaces : 0,
            deletedOnly: false,
            starredOnly: false,
            recentOnly: false,
            sharedOnly: false,
            per_page: 100,
            orderBy: sortingInfo.sortBy,
            orderDir: sortingInfo.sortDir,
          },
        },
      );
      setAllData(response.data.data);
      console.log(response.status);
      if (response.status === 403) {
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Got Error', error);
      if (error.response && error.response.status === 403) {
        navigation.replace('Login'); // Redirect to login page
      }
    } finally {
      setIsLoading(false);
    }
  }, [ currentFolderId, workspaces]);
  const handleSortApply = ({sortBy, sortDir}) => {
    setSortingInfo({sortBy, sortDir}); // Update the state
    fetchData(sortBy, sortDir); // Fetch data with new sort options
    console.log('Sort applied:', sortBy, sortDir);
  };



  // useEffect(() => {
  //   const hasAccess = accessData(user);
  //   setHasAccess(hasAccess);
  //   console.log('User has access:', hasAccess);
  // }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const organizedData = useMemo(() => {
    return allData.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [allData]);
  const handleFolderCreationSuccess = () => {
    fetchData();
  };

  // const handleItemPress = useCallback(
  //   item => {
  //     if (item.type === 'folder') {
  //       setFolderStack(prev => [...prev, {id: item.id, name: item.name}]);
  //     } else if (
  //       ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(
  //         item.extension.toLowerCase(),
  //       )
  //     ) {
  //       // Navigate to ImageViewer if the item is an image
  //       navigation.navigate('ImageViewer', {
  //         filePath: item,
  //         user: user,
  //       });
  //     } else if (item.type === 'pdf') {
  //       // Navigate to ImageViewer if the item is an image
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
  //     } else if (
  //       ['zip', 'tar', 'rar', 'exe', 'app', 'apk'].includes(item.extension)
  //     ) {
  //       navigation.navigate('Zipapkpreview', {
  //         filePath: item,
  //         user: user,
  //       });
  //     } else {
  //       console.log('File clicked:');
  //     }
  //   },
  //   [navigation, user, folderStack],
  // );

  const handleItemPress = useCallback(
    (item) => {
      if (item.type === 'folder') {
        setFolderStack((prev) => [...prev, { id: item.id, name: item.name }]);
      } 
      else if (
        ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension.toLowerCase())
      ) {
        console.log('File ID:', item.id);
        setImgaeid(item?.id)
        setImageViewModal(true)
       
      } 
      else {
        navigation.navigate('Previewfiles', {
          filePath: item,
          user: user,
        });
      }
    },
    [navigation, user, folderStack]
  );
  

  const handleBackPress = useCallback(() => {
    if (folderStack.length > 1) {
      setFolderStack(prev => prev.slice(0, -1));
    }
  }, [folderStack]);

  const toggleModalVisible = item => {
    setSelectedItem(item);
    setactionModal(!actionModal);
  };

  
  const renderItem = useCallback(
    ({item}) => (
      <FileItem
        item={item}
        grid={isGrid}
        user={user}
        handleMediaPreview={() => handleItemPress(item)}
        onOpenModal={toggleModalVisible}
        workspace={workspaces}
      />
    ),
    [isGrid, handleItemPress],
  );


  const handlecreateOpenModal = () => setShowmodal(true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.backgroundColor}}>
      <HomeHeader user={user} handleIconPress={() => setshowmodalAi(true)}
       handlecreateOpenModal={handlecreateOpenModal} />
      <View style={styles.container}>
        <ProgressBar />
        <View style={styles.statusContainer}>
          {/* <StorageStatus user={user} usertoken={user?.access_token} /> */}
          {/* <ProgressBar/> */}
        </View>
       
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            {folderStack.length > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}>
                <Icon name="arrow-back" size={24} color={COLORS.black} />
                <Text style={styles.backButtonText}>
                  {strings.Backto} {folderStack[folderStack.length - 2].name}
                </Text>
              </TouchableOpacity>
            )}
            {folderStack.length <= 1 && (
              <Text style={styles.currentFolderText}>{strings.HOME}</Text>
            )}
          </View>
          <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>

          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => setshowdropdown(true)}>
            <Text style={styles.currentFolderText}>{strings.SORT}</Text>
            <Image
              source={require('../../assets/icon/sorting.png')}
              style={{height: 25, width: 25, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Gridlist
            toggleView={handleGridListToggle}
            grid={isGrid}
          />
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : hasAccess ? ( // Corrected: Moved hasAccess check outside the extra curly braces
          <FlatList
            data={organizedData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={isGrid ? 2 : 1}
            onRefresh={onRefresh}
            refreshing={refreshing}
            key={isGrid ? 'list' : 'grid'}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
                color: COLORS.red,
              }}>
              {[
                strings.Warning_Yourdemoaccounthasexpired,
                strings.Purchasethepackageyouchoosenowtocontinueyourlife,
                strings.whichismadeeasierbyConiaCloud,
              ].join(' ')}
            </Text>
            <SubscriptionAnimation />
            <UpgradeButton />
          </>
        )}
        {/* <TouchableOpacity style={styles.btn} onPress={() => setShowmodal(true)}>
          <Text style={styles.text}>+</Text>
        </TouchableOpacity> */}
        {folderStack.length <= 1 && (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setshowworkspacemodal(true)}>
            {/* <Text style={styles.text}>+</Text> */}
            <Image
              source={require('../../assets/arrangement.png')}
              tintColor={COLORS.white}
            />
          </TouchableOpacity>
        )}
        {/* <ModalForUploadAndCreateFile
          visible={showmodal}
          user={user}
          folderId={currentFolderId} 
          onClose={() => setShowmodal(false)}/> */}
        <AnimationModal
          visible={showModalAi}
          onClose={() => setshowmodalAi(false)}
        />
        <ActionModal
          isVisible={actionModal}
          onClose={() => setactionModal(false)}
          user={user}
          item={selectedItem}
          onSuccess={handleFolderCreationSuccess}
        />
        <WorkspaceModal
          visible={workspacemodal}
          user={user}
          // folderId={currentFolderId}
          onClose={() => setshowworkspacemodal(false)}
        />
        <ShortingModal
          isVisible={showDrodown}
          onClose={() => setshowdropdown(false)}
          onApply={handleSortApply}
          sortingOptions={sortByOptions}
          initialSorting={sortingInfo}
        />
        <FileFolderModal
          visible={showmodal}
          user={user}
          folderId={currentFolderId}
          onClose={() => setShowmodal(false)}
          onSuccess={handleFolderCreationSuccess}
          // onUploadFile={handleUploadComplete}
        />
        <ImagepreviewModal
        visible={handleImageViewMidal}
        workspace={workspaces}
        onClose={()=>setImageViewModal(false)}
        imageId={imageId}
        user={user}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.boldText,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    marginLeft: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  currentFolderText: {
    //  paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: '1.5%',
    borderWidth: 1,
    backgroundColor: COLORS.DriveColor,
    borderRadius: 10,
  },
  grid: {
    width: '46%',
    padding: 8,
    margin: '1.5%',
    backgroundColor: COLORS.DriveColor,
    borderRadius: 10,
    borderWidth: 0.5,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.orenge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    marginTop: 5,
    fontSize: 16,
    color: COLORS.boldText,
    fontWeight: '600',
    // textAlign: 'center',
  },
  rightImage: {
    width: 20,
    height: 20,
  },
  moreicon: {
    height: 25,
    width: 10,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
  },
  btn: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#0071BC',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
  },
  statusContainer: {
    alignItems: 'center',
  },
  emptyText: {
    padding: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white, // Apply a tint color if applicable
  },
});

// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import { commonStyle } from '../../utils/Commomcss'
// import HomeHeader from '../../components/HomeHeader'
// import { useSelector } from 'react-redux'
// import ProgressBar from '../../components/ProgressBar'
// import strings from '../../helper/Language/LocalizedStrings'
// import { COLORS } from '../../utils/Colors'
// import AnimationModal from '../../Modaals/AnimationModal'
// import HandleItemPress from '../../constants/HandleItemPress'
// import RenderCardListGrid from '../../components/RenderCardListGrid'
// import { date } from 'yup'
// import axios from 'axios'
// import { baseURL } from '../../utils/constant/settings'
// import { current } from '@reduxjs/toolkit'
// import ShortingModal from '../../Modaals/ShortingModal'
// import getItemIcon from '../../constants/GetItemIcon'
// import Icon from 'react-native-vector-icons/MaterialIcons'
// import ActionModal from '../../Modaals/ActionModal'
// import ModalForUploadAndCreateFile from '../../Modaals/ModalForUpladAndCreateFile'

//   const sortByOptions = [
//     { key: strings.Size, value: 'file_size' },
//     { key: strings.Name, value: 'name' },
//     { key: strings.LastModified, value: 'updated_at' },
//     { key: strings.UploadDate, value: 'created_at' },
//   ];
// const Home = ({navigation}) => {
//     const user = useSelector((state) => state.auth.user);
//   const language = useSelector((state) => state.language.language);
//   const [folderStack, setFolderStack] = useState([{ id: null, name: strings.HOME }]);
//   const workspaces = useSelector(state => state.workspace.workspace);
//   const [grid, setGrid] = useState('list');
//   const [actionModal,setactionModal]=useState(false)
//   const [showDrodown,setshowdropdown]=useState(false)
//   const [showModalAi,setshowmodalAi]=useState(false)
//   const [loading,setIsLoading]=useState(false)
//   const [DriveData,SetDriveData]=useState([])
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showmodal,setShowmodal]=useState(false)
//   const [refreshing, setRefreshing] = useState(false);
//     const [sortingInfo, setSortingInfo] = useState({
//     sortBy: 'updated_at',
//     sortDir: 'desc',
//   });
//   const currentFolderId = folderStack[folderStack.length - 1].id;
//   const fetchData = useCallback(async () => {
//     try {
//         setIsLoading(true); // Start loading
//         const response = await axios.get(`${baseURL}/drive/file-entries`, {
//             headers: { Authorization: `Bearer ${user?.access_token}` },
//             params: {
//            pageId: 0,
//           folderId: currentFolderId,
//           page: 1,
//           workspaceId: workspaces?workspaces:0,
//           deletedOnly: false,
//           starredOnly: false,
//           recentOnly: false,
//           sharedOnly: false,
//           per_page: 100,
//           orderBy: sortingInfo.sortBy,
//           orderDir: sortingInfo.sortDir,
//             },
//         });
//         SetDriveData(response.data.data);
//         // console.log(response.data.data)
//         if (response.status === 403) {
//             navigation.replace('Login');
//         }
//     } catch (error) {
//         console.log('Error fetching data:', error);
//         if (error.response && error.response.status === 403) {
//             navigation.replace('Login');
//         }
//     } finally {
//         setIsLoading(false);
//     }
// }, [user, currentFolderId,workspaces,refreshing,setRefreshing]);

// const handleSortApply = ({ sortBy, sortDir }) => {
//   setSortingInfo({ sortBy, sortDir });
//   fetchData(currentFilter, sortBy, sortDir);
//   console.log('Sort applied:', sortBy, sortDir);
// };

// useEffect(() => {
//   fetchData();
// }, [fetchData]);
// const handleFilterSelection = (filter) => {
//   setCurrentFilter(filter);
//   fetchData(filter);
// };

// useEffect(() => {
//   fetchData();
// }, [fetchData, currentFolderId, user,sortingInfo,]);

// const onRefresh = useCallback(async () => {
//   setRefreshing(true);
//   await fetchData();
//   setRefreshing(false);
// }, [fetchData]);

// const organizedData = useMemo(() => {
//   return DriveData.sort((a, b) => {
//     if (a.type === 'folder' && b.type !== 'folder') return -1;
//     if (a.type !== 'folder' && b.type === 'folder') return 1;
//     return a.name.localeCompare(b.name);
//   });
// }, [DriveData]);

// const handleItemPress = useCallback((item) => {
//   if (item.type === 'folder') {
//     setFolderStack(prev => [...prev, { id: item.id, name: item.name }]);
//   } else if (['jpg', 'jpeg', 'png', 'gif', 'svg',].includes(item.extension.toLowerCase())) {
//     // Navigate to ImageViewer if the item is an image
//     navigation.navigate('ImageViewer',{
//       filePath: item,
//       user: user,
//     });

//   }
//   else if (item.type === 'pdf') {
//     // Navigate to ImageViewer if the item is an image
//     navigation.navigate('PdfView',{
//       filePath: item,
//       user: user,
//     });

//   } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)){
//     // navigation.navigate('VideoPreview', {
//     navigation.navigate('VideoPreview', {
//       filePath: item,
//       user: user,
//     });
//   } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)){
//     navigation.navigate('AudioPreview', {
//       filePath: item,
//       user: user,
//     });
//   }
//   else if (['doc', 'docx'].includes(item.extension)){
//     navigation.navigate('WordPreview', {
//       filePath: item,
//       user: user,
//     });
//   }
//   else if (['pptx','ppt','odp'].includes(item.extension)){
//     navigation.navigate('PptPreview', {
//       filePath: item,
//       user: user,
//     });
//   }
//   else if (['xls','xlsx','csv','ods'].includes(item.extension)){
//     navigation.navigate('SpreadsheetPreview', {
//       filePath: item,
//       user: user,
//     });
//   }
//   else if (['txt'].includes(item.extension)){
//     navigation.navigate('TextFilePreview', {
//       filePath: item,
//       user: user,
//     });
//   }
//   else if (['zip','tar','rar','exe','app','apk'].includes(item.extension)){
//     navigation.navigate('Zipapkpreview', {
//       filePath: item,
//       user: user,
//     });
//   }else {
//     console.log('File clicked:',);
//   }
// }, [navigation, user, folderStack]);

// const handleBackPress = useCallback(() => {
//   if (folderStack.length > 1) {
//     setFolderStack(prev => prev.slice(0, -1));
//   }
// }, [folderStack]);

//   const toggleModalVisible = (item) => {
//     setSelectedItem(item);
//     setactionModal(!actionModal);
//     console.log('Selected Item:', item);
//   };

//   const renderItem = ({ item }) => (
//     <RenderCardListGrid item={item} isGrid={grid === 'grid'} onPress={() => handleItemPress(item)}
//     getIcon={getItemIcon(item)}
//     action={()=>toggleModalVisible(item)}/>
//   );
//   return (
//     <View style={commonStyle.container}>
//     <HomeHeader user={user} handleIconPress={() => setshowmodalAi(true)} />
//     <ProgressBar/>
//     {/* List Grid Part Start */}
//          <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingVertical:8 }}>
//         <Text style={commonStyle.heading}>{strings.RECENTLY_EDITED}</Text>
//          <View style={{ flexDirection: "row", gap: 10 }}>
//           <TouchableOpacity onPress={() => setGrid('list')}>
//              <Image source={require('../../assets/list.png')} style={[styles.rightImage, { tintColor: grid ==='list' ? '#004181' : '#B3B4B6' }]} />
//            </TouchableOpacity>
//           <TouchableOpacity onPress={() => setGrid('grid')}>
//              <Image source={require('../../assets/Grid.png')} style={[styles.rightImage, { tintColor: grid ==='grid'? '#004181' : '#B3B4B6' }]} />
//            </TouchableOpacity>
//         </View>
//       </View>
//        {/* List Grid Part End */}
//        {/* <View style={{ ...styles.line}}>
//           </View> */}
//           {/* <HandleItemPress
//           // onPress={handleBackPress}
//           // setShowDropdown={}
//           /> */}
//  <View style={{ borderBottomWidth: 1,
//         borderBottomColor: '#E0E0E0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
//           <View>
//       {folderStack.length > 1 && (
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <Icon name="arrow-back" size={24} color={COLORS.black} />
//           <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
//         </TouchableOpacity>
//       )}{
//         folderStack.length<=1 &&(
//           <Text style={styles.currentFolderText}>{strings.HOME}</Text>
//         )
//       }

//       </View>
//       <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>setshowdropdown(true)}>
//         <Text style={styles.currentFolderText}>{strings.SORT}</Text>
//         <Image source={require('../../assets/icon/sorting.png')} style={{height:25,width:25,resizeMode:'contain'}}/>
//       </TouchableOpacity>
//       </View>

// <FlatList
//         data={organizedData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         key={grid}
//         numColumns={grid === 'grid' ? 2 : 1}
//         contentContainerStyle={{ paddingBottom: 20 }}
//        showsVerticalScrollIndicator={false}
//        onRefresh={onRefresh}
//        refreshing={refreshing}
//                  ListEmptyComponent={<View style={{flex:1,alignItems:'center'}}>
//             <Text style={styles.emptyText}>This folder is empty</Text>
//           </View>}
//       />
//               <TouchableOpacity style={styles.btn}
//       onPress={()=>setShowmodal(true)}
//       >
//             <Text style={styles.text}>+</Text>
//           </TouchableOpacity>
//       //             <ActionModal
//             isVisible={actionModal}
//             onClose={()=>setactionModal(false)}
//             user={user}
//             item={selectedItem}/>
//       <AnimationModal visible={showModalAi} onClose={() => setshowmodalAi(false)} />
//                 <ShortingModal
//             isVisible={showDrodown}
//             onClose={()=>setshowdropdown(false)}
//              onApply={handleSortApply}
//             sortingOptions={sortByOptions}
//             initialSorting={sortingInfo}
//  />
//            <ModalForUploadAndCreateFile
//            refreshing={refreshing}
//           visible={showmodal}
//           user={user}
//            folderId={currentFolderId}
//           onClose={() => setShowmodal(false)}/>

//     </View>
//   )
// }

// export default Home

// const styles = StyleSheet.create({
//     rightImage: {
//     width: 20,
//     height: 20,
//   },
//   line:{
//     borderBottomWidth: 1,
//         borderBottomColor: '#E0E0E0',
//         flexDirection:'row',
//         justifyContent:'space-between',
//         alignItems:'center'
//   },
//     backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   backButtonText: {
//      marginLeft: 10,
//     color: COLORS.primary,
//     fontSize: 16,
//   },
//     btn: {
//     position: 'absolute',
//     right: 20,
//     bottom: 40,
//     backgroundColor: '#0071BC',
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     color: '#fff',
//     fontSize: 30,
//   },
// })
