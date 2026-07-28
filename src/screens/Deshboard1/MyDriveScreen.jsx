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
import {debounce} from 'lodash';
import SearchBarCompo from '../../components/SerchBarCompo';
import folderIcon from '../../assets/icons/folder.png'
// import folderIcon from '../../assets/icon/folder.png';
import fileIcon from '../../assets/icon/file.png';
import pdfIcon from '../../assets/icons/pdf.png';
import play from '../../assets/icons/pdf.png';
import video from '../../assets/icon/video.png';
import wordIcon from '../../assets/icon/word.png';
import imageIcon from '../../assets/icon/image.png';
import All from '../../assets/icon/all.png'
import Filter from '../../components/Filter';

const MyDriveScreen = ({ navigation }) => {
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
   const [searchQuery, setSearchQuery] = useState('');
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
  const currentthme = useSelector(state => state.theme.theme);

  const currentFolderID = folderHistory[folderHistory.length - 1];// Assuming you are always working in the root folder or managing this elsewhere
  const FilderData = [
    { id: 1, Image: folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoicGRmIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMDYifV0%3D' },
    { id: 2, Image: fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoid29yZCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjA4In1d' },
    { id: 3, Image: imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D' },
    { id: 4, Image: video, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' },
    { id: 5, Image: All, title:strings.ALL, filters: '' },
  ];


   const [showModalAi, setshowmodalAi] = useState(false);
     const [showmodal, setShowmodal] = useState(false);
       const [actionModal, setactionModal] = useState(false);
        const [showDrodown, setshowdropdown] = useState(false);
         const [handleImageViewMidal,setImageViewModal]=useState(false)
          const [imageId,setImgaeid]=useState(0)
           const [currentFilter, setCurrentFilter] = useState(null);
   const handlecreateOpenModal = () => setShowmodal(true);


   const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };
   const debouncedSetSearchQuery = useCallback(
      debounce(query => {
        setSearchQuery(query);
      }, 500),
      [],
    );
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
  const fetchData = useCallback(async (pageNum = 1,sortBy = sortingInfo.sortBy, sortDir = sortingInfo.sortDir,filter = null) => {
    try {
      // console.log('Fetching data for page:', pageNum); // Log page number when fetching data

      setIsLoading(pageNum === 1); // Show the loading spinner only when loading the first page
      setIsLoadingMore(pageNum > 1); // Show "loading more" spinner if loading more data

      const response = await axios.get(
        `${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`,
        {
          headers: { Authorization: `Bearer ${user?.access_token}` },
          params: {
            folderId: currentFolderID,
            workspaceId: workspaces ? workspaces : 0,
            deletedOnly: false,
            starredOnly: false,
            recentOnly: true,
            sharedOnly: false,
            per_page: 30,
            page: pageNum, // Pagination logic
            orderBy:sortBy,
            orderDir: sortDir,
            query: searchQuery,
            filters: filter,
          },
        }
      );

      // console.log('Response data:', response.data); // Log response data
      // setcurrentPage(response?.data?.current_page)
      // console.log(response?.data?.current_page,'Current Page')
      setFileFolderData(prevData => {
        const newData = pageNum === 1 ? response.data.data : [...prevData, ...response.data.data];

        // Remove duplicates based on 'id'
        const uniqueData = Array.from(
          new Map(newData.map(item => [item.id, item])).values()
        );

        return uniqueData;
      });

      // Set the total number of pages from the backend response
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
  }, [currentFolderID, workspaces, user,searchQuery]);

  useEffect(() => {
    fetchData(page); // Fetch initial data based on current page
  }, [page, fetchData,workspaces]); 
  // Dependency on page ensures the useEffect runs when the page changes
  useEffect(() => {
    // Reset to root folder, page 1, and clear data
    setFolderHistory([0]);
    setPage(1);
    setFileFolderData([]);
  }, [workspaces]); 

 // ✅ Correct - pass filter as 4th parameter
const handleFilterSelection = (filter) => {
  setCurrentFilter(filter);
  // Reset to page 1 when filter changes
  fetchData(1, sortingInfo.sortBy, sortingInfo.sortDir, filter,);
};

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

  const handleItemClick = item => {
    if (item.type === 'folder') {
      setFolderHistory(prevHistory => [...prevHistory, item.id]); // Push new folder ID to history stack
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
    [isGrid, handleItemClick,workspaces],
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
      backgroundColor:currentthme === 'dark' ? COLORS.black : COLORS.backgroundColor,
    }}>

         <HomeHeader user={user} handleIconPress={() => setshowmodalAi(true)}
       handlecreateOpenModal={handlecreateOpenModal} />
        
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>📂 My Drive</Text> */}
       <View style={styles.statusContainer}>
                {/* <StorageStatus user={user} usertoken={user?.access_token} /> */}
                {/* <ProgressBar user={user} usertoken={user?.access_token}/>
                 */}
                  <SearchBarCompo
          search={searchQuery}
          setSearchQuery={query => {
            debouncedSetSearchQuery(query);
            setSearchQuery(query);
          }}
        />
              </View>
              {/* <View style={{height:110}}>

<Filter
       FilterData={FilderData}
       selectedFilter={currentFilter}
       handleFilterSelect={handleFilterSelection}
       />
</View> */}

<View style={{flexDirection:'row',justifyContent:'space-between'}}>
  

      {folderHistory.length > 1 && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#0071BC" />
          <Text style={styles.backText}>{strings.Backto}</Text>
        </TouchableOpacity>
      )}
      <View/>
 <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>

<TouchableOpacity
  style={{flexDirection: 'row', alignItems: 'center'}}
  onPress={() => setshowdropdown(true)}>
  <Text style={{...styles.currentFolderText,color:currentthme === 'dark' ? 'white' : 'black'}}>{strings.SORT}</Text>
  <Image
    source={require('../../assets/icon/sorting.png')}
    style={{height: 25, width: 25, resizeMode: 'contain'}}
    tintColor={currentthme === 'dark' ? 'white' : 'black'}
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
          ListEmptyComponent={(<EmptyComponent text={strings.THIS_FIEL_FOLDERISEMPTY}/>)}
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

      {/* <TouchableOpacity style={styles.btn} onPress={() => setshowworkspacemodal(true)}>
        <Image source={require('../../assets/arrangement.png')} tintColor={COLORS.white} />
      </TouchableOpacity> */}

      <WorkspaceModal visible={workspacemodal} user={user} onClose={() => setshowworkspacemodal(false)} />
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
    </View>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.backgroundColor,
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


export default MyDriveScreen

