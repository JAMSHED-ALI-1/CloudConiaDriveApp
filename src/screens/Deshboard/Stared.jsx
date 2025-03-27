// import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, SafeAreaView ,Dimensions, TextInput} from 'react-native';
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import { COLORS } from '../../utils/Colors';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { baseURL, fileColorCode } from '../../utils/constant/settings';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { timeAgo } from '../../helper/functionHelper';
// import { useNavigation } from '@react-navigation/native';
// import CustomHeader from '../../components/CustomHeader';
// import folderIcon from '../../assets/icon/folder.png';
// import fileIcon from '../../assets/icon/file.png';
// import pdfIcon from '../../assets/icons/pdf.png';
// import play from '../../assets/icons/pdf.png';
// import video from '../../assets/icon/video.png';
// import wordIcon from '../../assets/icon/word.png';
// import All from '../../assets/icon/all.png'
// import imageIcon from '../../assets/icon/image.png';
// import ProgressBar from '../../constants/Userinfo';
// import ActionModal from '../../Modaals/ActionModal';
// import strings from '../../helper/Language/LocalizedStrings';
// import getItemIcon from '../../constants/GetItemIcon';
// import { accessData } from '../../utils/UserAccessData';
// import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
// import AnimationModal from '../../Modaals/AnimationModal';
// import FileFolderModal from '../../Modaals/FileFolderModal';
// import HomeHeader from '../../components/HomeHeader';
// import Filter from '../../components/Filter';
// import FileItem from '../../components/RenderCardListGrid';
// import Gridlist from '../../constants/Gridlist';
// import UpgradeButton from '../../components/UpgradeButton';
// import EmptyComponent from '../../components/EmptyComponent';
// import ImagepreviewModal from '../../Modaals/ImagepreviewModal';
// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;
// const Stared = () => {
//   const user = useSelector((state) => state.auth.user);
//   const [hasAccess, setHasAccess] = useState(false);
//   const workspaces = useSelector(state => state.workspace.workspace);
//   const language = useSelector((state) => state.language.language);
//   const navigation=useNavigation()
//   const [folderStack, setFolderStack] = useState([{ id: null, name: strings.STARED_FILES }]);
//   const [allData, setAllData] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isGrid, setIsGrid] = useState(true);
//   const [currentFilter, setCurrentFilter] = useState(null);
//   const [search, setSearch] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [actionModal,setactionModal]=useState(false);
//   const [opencreateuplodModal, setopencreateModal] = useState(false);
//   const [showModalAi, setshowmodalAi] = useState(false);
//   const handlecreateOpenModal = () => setopencreateModal(true);
//   const handleclosecreatefolderFileModal = () => setopencreateModal(false);
//     const [handleImageViewMidal,setImageViewModal]=useState(false)
//                 const [imageId,setImgaeid]=useState(0)
//   const handleGridListToggle = () => {
//     setIsGrid(!isGrid);
//   };

//   useEffect(() => {
//     const hasAccess = accessData(user);
//     setHasAccess(hasAccess);
//     console.log('User has access:', hasAccess);
//   }, [user]);
//   const toggleModalVisible = (item) => {
//     setSelectedItem(item); 
//     setactionModal(!actionModal);
//   };
//   const FilderData = [
//     { id: 1, Image: folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiZm9sZGVyIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMTEifV0%3D' },
//     { id: 2, Image: fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidGV4dCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjAyIn1d' },
//     { id: 3, Image: imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D' },
//     { id: 4, Image: video, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' },
//     { id: 5, Image: All, title:strings.ALL, filters: '' },
//   ];





//   const currentFolderId = folderStack[folderStack.length - 1].id;

//   const fetchData = useCallback(async (filter = null) => {
//     try {
//       setIsLoading(true);
//     //     const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}${pageId}&folderId=${folderId}&workspaceId==${workspaces}&orderBy=updated_at&orderDir=desc&page=1&sharedOnly=true`, {
//       const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
//         headers: { Authorization: `Bearer ${user?.access_token}` },
//         params: {
//           pageId: search?search:' starred',
//           filters: filter,
//           folderId: currentFolderId, // Use the current folder ID to fetch folder contents
//           page: 1,
//           workspaceId: workspaces,
//           deletedOnly: false,
//           starredOnly: true,
//           recentOnly: false,
//           sharedOnly: false,
//           per_page: 100,
//           orderBy: 'updated_at',
//           orderDir: 'desc',
//         },
//       });
//       setAllData(response.data.data);
//     //   console.log(response.data.data)
//     } catch (error) {
//       console.log('Got Error', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user, currentFolderId, workspaces, search]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);
//   const handleFilterSelection = (filter) => {
//     setCurrentFilter(filter); // Update the current filter
//     fetchData(filter); // Fetch data based on the selected filter
//   };
  
//   useEffect(() => {
//     fetchData();
//   }, [fetchData, currentFolderId, user]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchData();
//     setRefreshing(false);
//   }, [fetchData]);

//   const organizedData = useMemo(() => {
//     return allData.sort((a, b) => {
//       if (a.type === 'folder' && b.type !== 'folder') return -1;
//       if (a.type !== 'folder' && b.type === 'folder') return 1;
//       return a.name.localeCompare(b.name);
//     });
//   }, [allData]);


//   const handleItemPress = useCallback(async (item) => {
//     if (item.type === 'folder') {
//       try {
//         // Add new folder to the stack
//         setFolderStack((prev) => [
//           ...prev,
//           {
//             id: item.id,
//             name: item.name,
//             hash: item.hash,
//           },

//         ]);
  
//         // Fetch the contents of the new folder
//         const response = await axios.get(`${baseURL}/drive/file-entries`, {
//           headers: { Authorization: `Bearer ${user?.access_token}` },
//           params: {
//             pageId: item.hash, // Use the item's hash
//             folderId: item.hash, // Folder ID as the item's hash
//             workspaceId: 0, // You specified workspaceId as 0
//             orderBy: 'updated_at',
//             orderDir: 'desc',
//             page: 1,
//           },
//         });
  
//         // Handle the successful response
//         const data = response.data.data;
//         // console.log('Fetched folder contents:', data);
//         setAllData(data); // Update state with the new folder data
  
//       } catch (error) {
//         console.error('Error fetching folder contents:', error);
//       }
//     } else if (item.type === 'image') {
//       // Navigate to the ImageViewer if the item is an image
//       navigation.navigate('ImageViewer', {
//         filePath: item,
//         user: user,
//       });
//     }
//   }, [navigation, user,folderStack]);

//   const handleBackPress = useCallback(async () => {
//     if (folderStack.length > 1) {
//       try {
//         // Get the previous folder's information
//         const previousFolder = folderStack[folderStack.length - 2];
        
//         // Remove the current folder from the stack
//         setFolderStack(prev => prev.slice(0, -1));

//         // Fetch the contents of the previous folder
//         const response = await axios.get(`${baseURL}/drive/file-entries`, {
//           headers: { Authorization: `Bearer ${user?.access_token}` },
//           params: {
//             pageId: search || 0,
//             filters: currentFilter,
//             folderId: previousFolder.id, // Use the previous folder's ID
//             page: 1,
//             workspaceId: workspaces?workspaces:0,
//             deletedOnly: false,
//             starredOnly: false,
//             recentOnly: false,
//             sharedOnly: true,
//             per_page: 100,
//             orderBy: 'updated_at',
//             orderDir: 'desc',
//           },
//         });
//         setAllData(response.data.data);
//         if(response.status===403){
//           navigation.replace('Login')
//         }
//       } catch (error) {
//         console.error('Error fetching previous folder contents:', error);
       
//       }
//     }
//   }, [folderStack, user, currentFilter, workspaces, search]);


//   const handleFolderCreationSuccess = () => {
//     fetchData()
//   };
//   const renderItem = useCallback(
//     ({item}) => (
//       <FileItem
//         item={item}
//         grid={isGrid}
//         handleMediaPreview={() => handleItemPress(item)}
//         onOpenModal={toggleModalVisible}
//         user={user}
//         // handleMediaPreview={() => handleItemClick(item)}
//         // onOpenModal={toggleModalVisible}
//         workspace={workspaces}
//       />
//     ),
//     [isGrid, handleItemPress],
//   );



//   return (
//     <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>
   
//    <HomeHeader
//         user={user}
//         handleIconPress={() => setshowmodalAi(true)}
//         handlecreateOpenModal={handlecreateOpenModal}
//       />
//       <View style={{height:110}}>

// <Filter
//        FilterData={FilderData}
//        selectedFilter={currentFilter}
//        handleFilterSelect={handleFilterSelection}
//        />
// </View>
   
//     <View style={styles.container}>
       

// <View style={{ borderBottomWidth: 1,
//         borderBottomColor: '#E0E0E0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
//           <View>
//       {folderStack.length > 1 && (
//         <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//           <Icon name="arrow-back" size={24} color={COLORS.black} />
//           <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
//         </TouchableOpacity>
//       )}
//       {
//         folderStack.length<=1 &&(
//           <Text style={styles.currentFolderText}>{strings.STARED_FILES}</Text>
//         )
//       }

//       </View>
   
//       <Gridlist
//             toggleView={handleGridListToggle}
//             grid={isGrid}
//             // setShowDropdown={() => setShowDropdown(true)}
//           />
//       </View>
     
//       {isLoading ? (
//           <ActivityIndicator size="large" color={COLORS.blue} />
//         ) : hasAccess ? ( // Corrected: Moved hasAccess check outside the extra curly braces
//           <FlatList
        
//           data={organizedData}
//           // renderItem={isGrid ? renderItemList:renderItemGrid}
//           // keyExtractor={item => item.id.toString()}
         
//           // numColumns={isGrid ? 1 : 2}
//           // onRefresh={onRefresh}
//           // refreshing={refreshing}
//           // key={isGrid ?  'list':'grid'} 
//           renderItem={renderItem}
//           keyExtractor={item => item.id.toString()}
         
//           numColumns={isGrid ? 2 : 1}
//           onRefresh={onRefresh}
//           refreshing={refreshing}
//           key={isGrid ?  'list':'grid'} 
        
       
        
        
          
      
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={EmptyComponent}
//           contentContainerStyle={styles.listContent}
//         />
        
//         ) : (
//           <>
//           <Text style={{fontSize:16,fontWeight:'500',textAlign:"center",color:COLORS.red}}>
// {[strings.Warning_Yourdemoaccounthasexpired, strings.Purchasethepackageyouchoosenowtocontinueyourlife, strings.whichismadeeasierbyConiaCloud].join(' ')}
// </Text>
//           <SubscriptionAnimation />
// <UpgradeButton/>
//         </>
//         )}
     
//       <ActionModal 
//             isVisible={actionModal} 
//             onClose={()=>setactionModal(false)}
//             user={user}
//             item={selectedItem}/>
//                 <FileFolderModal
//           visible={opencreateuplodModal}
//           onClose={handleclosecreatefolderFileModal}
//           onSuccess={handleFolderCreationSuccess}
//           user={user}
//           folderId={selectedItem}
//         />
//         <AnimationModal
//           visible={showModalAi}
//           onClose={() => setshowmodalAi(false)}
//         />
//          <ImagepreviewModal
//         visible={handleImageViewMidal}
//         workspace={workspaces}
//         onClose={()=>setImageViewModal(false)}
//         imageId={imageId}
//         user={user}
//         />
//     </View>
//     </SafeAreaView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.backgroundColor,
//     padding:10
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   backButtonText: {
//     marginLeft: 10,
//     color: COLORS.primary,
//     fontSize: 16,
//   },
//   currentFolderText: {
//     padding: 10,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color:COLORS.black
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     margin: '1.5%',
//     borderWidth: 1,
//     backgroundColor:COLORS.DriveColor,
//     borderRadius:10,
    
//   },
//   grid: {
//     width: '46%',
//     padding: 8,
//     margin: '1.5%',
//   backgroundColor:COLORS.DriveColor,
//     borderRadius:10,
//     borderWidth:0.5,
//     alignSelf:'center',
//     flexDirection:'row',
//     justifyContent:"space-between"
//   },
//   iconContainer: {
//     height: 50,
//     width: 50,
//     borderRadius: 50,
//     backgroundColor: COLORS.orenge,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   itemText: {
//     marginTop: 5,
//     fontSize: 16,
//     color:COLORS.boldText,
//     fontWeight:'600'
//     // textAlign: 'center',
//   },
//   rightImage: {
//     width: 24,
//     height: 24,
//   },
//   moreicon: {
//     height: 25,
//     width: 10,
//     resizeMode: 'contain',
//     position:'absolute',
//     right:0
    
//   },
//   emptyText:{
//     padding:10,
//     textAlign:'center',
//     marginTop:30},
//     folderContainer: {
//       flexDirection: 'row',
//       marginTop: windowHeight * 0.02,
//     },
//     folderItem: {
//       alignItems: 'center',
//       // marginBottom: 20,
//       padding: 14,
//       // backgroundColor:'red',
//       // // width: '45%',
//       // margin:10
//     },
//     folderIcon: {
//       height: windowHeight * 0.05, // Adjust folder icon size based on screen height
//       width: windowWidth * 0.12, // Adjust width for responsiveness
//       marginBottom: windowHeight * 0.01,
//       resizeMode: 'contain',
//       // marginBottom: 10,
//       // backgroundColor:'red',
//       // width: '45%',
//     },
//     folderTitle: {
//       fontSize: 14,
//       fontWeight: '500',
//       color: '#071625',
//     },
//     filtercontainer: {
//       padding: 8,
//       backgroundColor: '#D7EFFF',
//       borderRadius: 10,
//     },
//     statusContainer: {
//       alignItems: "center",
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         paddingHorizontal: 15,
//         height: 45,
//         width: '95%',
//         alignSelf: 'center',
//         marginTop: 40,
//       },
//       leftImage: {
//         width: 24,
//         height: 24,
//         marginRight: 10,
//       },
//       input: {
//         flex: 1,
//         height: '100%',
//       },
//       icon: {
//         width: 24,
//         height: 24,
//         tintColor: COLORS.white, // Apply a tint color if applicable
//       },
// });




// export default Stared




import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { baseURL } from '../../utils/constant/settings';
import axios from 'axios';
import { COLORS } from '../../utils/Colors';
import WorkspaceModal from '../../Modaals/WorkspaceModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeHeader from '../../components/HomeHeader';
import AnimationModal from '../../Modaals/AnimationModal';
import FileFolderModal from '../../Modaals/FileFolderModal';
import FileItem from '../../components/RenderCardListGrid';
import ActionModal from '../../Modaals/ActionModal';
import EmptyComponent from '../../components/EmptyComponent';
import strings from '../../helper/Language/LocalizedStrings';
import Gridlist from '../../constants/Gridlist';
import ShortingModal from '../../Modaals/ShortingModal';
import { accessData } from '../../utils/UserAccessData';
import ImagepreviewModal from '../../Modaals/ImagepreviewModal';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
import UpgradeButton from '../../components/UpgradeButton';
import ProgressBar from '../../components/ProgressBar';
import UnshareModal from '../../Modaals/UnshareModal';

const Stared = ({ navigation }) => {
  const [filefolderData, setFileFolderData] = useState([]);
  const [folderHistory, setFolderHistory] = useState([0]);
   const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [page, setPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [selectedItem, setSelectedItem] = useState(null);
  const [workspacemodal, setshowworkspacemodal] = useState(false);
 
  const [sortingInfo, setSortingInfo] = useState({
      sortBy: 'updated_at',
      sortDir: 'desc',
    });
    const sortByOptions = [
      {key: strings.Size, value: 'file_size'},
      {key: strings.Name, value: 'name'},
      {key: strings.LastModified, value: 'updated_at'},
      {key: strings.UploadDate, value: 'created_at'},
    ];

  const user = useSelector(state => state.auth.user);
  const workspaces = useSelector(state => state.workspace.workspace);

  const currentFolderID = folderHistory[folderHistory.length - 1];// Assuming you are always working in the root folder or managing this elsewhere



   const [showModalAi, setshowmodalAi] = useState(false);
     const [showmodal, setShowmodal] = useState(false);
       const [actionModal, setactionModal] = useState(false);
        const [showDrodown, setshowdropdown] = useState(false);
         const [handleImageViewMidal,setImageViewModal]=useState(false)
          const [imageId,setImgaeid]=useState(0)
   const handlecreateOpenModal = () => setShowmodal(true);


   const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };
  const handleSortApply = ({ sortBy, sortDir }) => {
    setSortingInfo({ sortBy, sortDir }); // Update the state
    fetchData(1, sortBy, sortDir); // Fetch data immediately with new sorting
  };

  useEffect(() => {
      const hasAccess = accessData(user);
      setHasAccess(hasAccess);
      // console.log('User has access:', hasAccess);
    }, [user]);
  // Fetch data with pagination
  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setFolderHistory(prevHistory => [
        ...prevHistory,
        { folderId: item.hash, starredOnly: false } // Store folderId & starredOnly as an object
      ]);
  
      // Update Current Folder ID before fetching
      // setCurrentFolderID(item.hash);
  
      // Fetch new folder data after state update
      fetchData(1, sortingInfo.sortBy, sortingInfo.sortDir, item.hash, false);
    }
       else if (
      ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension.toLowerCase())
    ) {
      // console.log('File ID:', item.id);
      setImgaeid(item?.id)
      setImageViewModal(true)
     
    }  else {
      // Implement file download logic
      navigation.navigate('Previewfiles', {
        filePath: item,
        user: user,
      });
    }
  };
  
  const fetchData = useCallback(
    async (pageNum = 1, sortBy = sortingInfo.sortBy, sortDir = sortingInfo.sortDir, folderId = currentFolderID, starredOnly = true) => {
      try {
        setIsLoading(pageNum === 1);
        setIsLoadingMore(pageNum > 1);
  
        const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
          params: {
            folderId: folderId, // Use updated folderId
            workspaceId: workspaces || 0,
            deletedOnly: false,
            starredOnly: starredOnly, // Update starredOnly based on folder press
            recentOnly: false,
            sharedOnly: false,
            per_page: 30,
            page: pageNum,
            orderBy: sortBy,
            orderDir: sortDir,
          },
        });
  
        setFileFolderData(prevData => {
          const newData = pageNum === 1 ? response.data.data : [...prevData, ...response.data.data];
  
          // Remove duplicates based on 'id'
          return Array.from(new Map(newData.map(item => [item.id, item])).values());
        });
  
        setTotalPages(response.data.last_page);
      } catch (error) {
        console.log('Error fetching data:', error);
        if (error.response?.status === 403) {
          navigation.replace('Login');
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [currentFolderID, workspaces, user]
  );
  

  useEffect(() => {
    fetchData(page); // Fetch initial data based on current page
  }, [page, fetchData]); // Dependency on page ensures the useEffect runs when the page changes

  // Load more data when reaching the end of the list
  const loadMoreData = () => {
    // console.log('Load more triggered, current page:', page); // Log when load more is triggered
    if (!isLoadingMore && page < totalPages) {
      setPage(prevPage => {
        const newPage = prevPage + 1;
        console.log('Loading next page:', newPage); // Log the next page number
        return newPage;
      });
    } else {
      console.log('No more pages to load or already loading.');
    }
  };

  // const handleItemClick = item => {
  //   if (item.type === 'folder') {
  //     setFolderHistory(prevHistory => [...prevHistory, item.id,starredOnly={false},folderId:item.hash]); // Push new folder ID to history stack
  //   }
  //   else if (
  //     ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension.toLowerCase())
  //   ) {
  //     // console.log('File ID:', item.id);
  //     setImgaeid(item?.id)
  //     setImageViewModal(true)
     
  //   }  else {
  //     // Implement file download logic
  //     navigation.navigate('Previewfiles', {
  //       filePath: item,
  //       user: user,
  //     });
  //   }
  // };

  const handleFolderCreationSuccess = () => {
    fetchData(1);
  };
  // // Render each item in the list
  // const renderItem = ({ item }) => (
  //   <TouchableOpacity onPress={() => handleItemClick(item)} style={styles.itemContainer}>
  //     {item.type === 'folder' ? (
  //       <Icon name="folder" size={24} color="#f4a261" style={styles.icon} />
  //     ) : (
  //       <Icon name="file" size={24} color="#2a9d8f" style={styles.icon} />
  //     )}
  //     <Text style={styles.itemText}>{item.name}</Text>
  //   </TouchableOpacity>
  // );

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
        handleMediaPreview={() => handleItemClick(item)}
        onOpenModal={toggleModalVisible}
        workspace={workspaces}
      />
    ),
    [isGrid, handleItemClick],
  );
  // Key extractor for FlatList
  const keyExtractor = (item) => {
    const key = `${item.id}-${item.name}`;
    return key;
  };
  const handleBackPress = () => {
    if (folderHistory.length > 1) {
      setFolderHistory(prevHistory => prevHistory.slice(0, -1)); // Remove the last folder ID to go back
    }
  };
  return (
    <SafeAreaView style={{
      flex:1,
      backgroundColor:COLORS.backgroundColor
    }}>

         <HomeHeader user={user} handleIconPress={() => setshowmodalAi(true)}
       handlecreateOpenModal={handlecreateOpenModal} />
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>📂 My Drive</Text> */}
       <View style={styles.statusContainer}>
                {/* <StorageStatus user={user} usertoken={user?.access_token} /> */}
                <ProgressBar user={user} usertoken={user?.access_token}/>
              </View>

<View style={{flexDirection:'row',justifyContent:'space-between'}}>
  

      {folderHistory.length > 1 && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#0071BC" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      <View/>
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
        <ActivityIndicator size="large" />
      ) : hasAccess ? (
        <FlatList
          data={filefolderData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={loadMoreData} // Trigger pagination when user reaches end of list
          onEndReachedThreshold={0.5} // Trigger when 50% of the list is scrolled
          ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" /> : null} // Show "loading more" spinner at the bottom
          numColumns={isGrid ? 2 : 1}
          // onRefresh={onRefresh}
          // refreshing={refreshing}
          key={isGrid ? 'list' : 'grid'}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={styles.listContent}
        />
      ): (
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

     

      <FileFolderModal
          visible={showmodal}
          user={user}
          folderId={currentFolderID}
          onClose={() => setShowmodal(false)}
          onSuccess={handleFolderCreationSuccess}
          // onUploadFile={handleUploadComplete}
        />
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
         <ShortingModal
          isVisible={showDrodown}
          onClose={() => setshowdropdown(false)}
          onApply={handleSortApply}
          sortingOptions={sortByOptions}
          initialSorting={sortingInfo}
        />
         <ImagepreviewModal
        visible={handleImageViewMidal}
        workspace={workspaces}
        onClose={()=>setImageViewModal(false)}
        imageId={imageId}
        user={user}
        />
        <UnshareModal
        visible={actionModal}
        />
    </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
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
    zIndex:1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  backText: {
    fontSize: 16,
    color: '#0071BC',
    marginLeft: 5,
  },
  statusContainer: {
    alignItems: 'center',
  },
  currentFolderText:{
    fontSize:14,
    fontWeight:'500',
    color:COLORS.black
  }
});





export default Stared



