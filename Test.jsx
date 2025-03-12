// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector } from 'react-redux';
// import { useGetFileFolderQuery } from './src/redux/reducers/services/filefolderApi';
// import MediaPreview from './src/screens/preview/PreviewModal';
// import { COLORS } from './src/utils/Colors';
// import FileFolderModal from './src/Modaals/FileFolderModal';
// import FileItem from './src/components/RenderCardListGrid';
// import ActionModal from './src/Modaals/ActionModal';
// import HomeHeader from './src/components/HomeHeader';
// import AnimationModal from './src/Modaals/AnimationModal';
// import ProgressBar from './src/components/ProgressBar';
// import strings from './src/helper/Language/LocalizedStrings';
// import ShortingModal from './src/Modaals/ShortingModal';
// import WorkspaceModal from './src/Modaals/WorkspaceModal';

// const Test = ({ navigation,worspaceActive,upladActive,filter }) => {
//   const user = useSelector((state) => state.auth.user);
//   const workspaces = useSelector((state) => state.workspace.workspace);
//   const language = useSelector((state) => state.language.language);
//   const [grid, setGrid] = useState(false);
//   const [showAImodal,setshowAImodal]=useState(false)
//   const [folderHistory, setFolderHistory] = useState([0]); 
//   const [localData, setLocalData] = useState([]);
//   const [isFolderChanging, setIsFolderChanging] = useState(false);
//   const [opencreateuplodModal,setopencreateModal]=useState(false)
//   const [actionModal, setActionModal] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [workspacemodal,setshowworkspacemodal]=useState(false)
//   const [sortingInfo, setSortingInfo] = useState({
//     sortBy: 'updated_at',
//     sortDir: 'desc',
//   });
//   const sortByOptions = [
//     { key: strings.Size, value: 'file_size' },
//     { key: strings.Name, value: 'name' },
//     { key: strings.LastModified, value: 'updated_at' },
//     { key: strings.UploadDate, value: 'created_at' },
//   ];
//   const handleSortApply = ({ sortBy, sortDir }) => {
//     setSortingInfo({ sortBy, sortDir });
//   };
//   // console.log(filter)
//   // const handleFilterSelection = (filter) => {
//   //   console.log(filter)
//   //   setCurrentFilter(filter); // Update the current filter
//   //   fetchData(filter); // Fetch data based on the selected filter
//   // };
//   const params = useMemo(() => ({
//     pageId: 0,
//     folderId: folderHistory[folderHistory.length - 1],
//     page: 1,
//     workspaceId: workspaces || 0,
//     deletedOnly: false,
//     starredOnly: false,
//     recentOnly: false,
//     sharedOnly: false,
//     per_page: 100,
//     orderBy: sortingInfo.sortBy,
//     orderDir: sortingInfo.sortDir,
//     filters: filter,
//   }), [folderHistory, sortingInfo, workspaces,filter]);


//   const { data, error, isLoading, refetch } = useGetFileFolderQuery(params);

//   useEffect(() => {
//     if (data?.data) {
//       setLocalData(data.data);
//       setIsFolderChanging(false);
//     }
//   }, [data]);
//   const toggleModalVisible = (item) => {
//     setSelectedId(item); 
//     setActionModal(!actionModal);
//   };
//   const handleMediaPreview = useCallback((item) => {
//     if (item.type === 'folder') {
//       setIsFolderChanging(true);
//       setFolderHistory(prev => [...prev, item.id]);
//     } else {
//       const extension = item.extension?.toLowerCase();
      
//       if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
//         navigation.navigate('ImageViewer', { filePath: item, user });
//       } else if (item.type === 'pdf') {
//         navigation.navigate('PdfView', { filePath: item, user });
//       } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(extension)) {
//         navigation.navigate('VideoPreview', { filePath: item, user });
//       } else if (['mp3', 'wav', 'aac', 'flac'].includes(extension)) {
//         navigation.navigate('AudioPreview', { filePath: item, user });
//       } else if (['doc', 'docx'].includes(extension)) {
//         navigation.navigate('WordPreview', { filePath: item, user });
//       } else if (['pptx', 'ppt', 'odp'].includes(extension)) {
//         navigation.navigate('PptPreview', { filePath: item, user });
//       } else if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
//         navigation.navigate('SpreadsheetPreview', { filePath: item, user });
//       } else if (extension === 'txt') {
//         navigation.navigate('TextFilePreview', { filePath: item, user });
//       } else if (['zip', 'tar', 'rar', 'exe', 'app', 'apk'].includes(extension)) {
//         navigation.navigate('Zipapkpreview', { filePath: item, user });
//       } else {
//         Alert.alert('Unsupported File', 'This file type cannot be previewed.');
//       }
//     }
//   }, [navigation, user]);
// useEffect(()=>{
// refetch()
// },[filter,refetch])
//   const handlecreateOpenModal = () => setopencreateModal(true);
//   const handleclosecreatefolderFileModal = () => setopencreateModal(false);
//   const handleFolderCreationSuccess = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   const goBack = useCallback(() => {
//     if (folderHistory.length > 1) {
//       setIsFolderChanging(true);
//       setFolderHistory(prev => {
//         const newHistory = [...prev];
//         newHistory.pop();
//         return newHistory;
//       });
//     }
//   }, [folderHistory.length]);

//   const toggleView = () => setGrid(!grid);

//   const renderItem = useCallback(({ item }) => (
//     <FileItem
//       item={item}
//       grid={grid}
//       handleMediaPreview={() => handleMediaPreview(item)}
//       onOpenModal={toggleModalVisible}
//     />
//   ), [grid, handleMediaPreview]);

//   const EmptyListComponent = () => (
//     <View style={styles.emptyContainer}>
//       <Icon name="folder-open-outline" size={50} color={COLORS.gray} />
//       <Text style={styles.emptyText}>This folder is empty</Text>
//     </View>
//   );

//   return (
//     <>
//     {/* <HomeHeader user={user} handleIconPress={() => setshowAImodal(true)}/> */}
//     <View style={styles.container}>
      
//       {/* <ProgressBar/> */}
//       <View style={styles.header}>
//         {folderHistory.length > 1 ? (
//           <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
//             <Icon name="arrow-back" size={24} color={COLORS.blue} />
//             <Text style={styles.goBackText}>{strings.goBack}</Text>
//           </TouchableOpacity>
//         ) : (
//           <View />
//         )}
//         <View style={styles.toggleContainer}>
//         <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>setShowDropdown(true)}>
//         <Text style={styles.currentFolderText}>{strings.SORT}</Text>
//         <Image source={require('./src/assets/icon/sorting.png')} style={{height:30,width:30,resizeMode:'contain'}}/>
//       </TouchableOpacity>
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

//       {isFolderChanging || isLoading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color={COLORS.blue} />
//         </View>
//       ) : (
//         <FlatList
//           data={localData}
//           keyExtractor={item => item.id.toString()}
//           renderItem={renderItem}
//           key={grid ? 'grid' : 'list'}
//           numColumns={grid ? 2 : 1}
//           onRefresh={refetch}
//           refreshing={isLoading}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={EmptyListComponent}
//           contentContainerStyle={styles.listContent}
//         />
//       )}

// {upladActive ? (
//   <TouchableOpacity 
//     style={styles.buttoncontainer}
//     onPress={handlecreateOpenModal}
//     accessibilityLabel="Upload Button"
//     accessibilityRole="button"
//   >
//     <Text style={styles.buttonText}>+</Text>
//   </TouchableOpacity>
// ) : null}

// {worspaceActive ?(<TouchableOpacity style={styles.btn} 
//       onPress={()=>setshowworkspacemodal(true)}
//       >
//             {/* <Text style={styles.text}>+</Text> */}
//             <Image source={require('./src/assets/arrangement.png')} tintColor={COLORS.white}/>
//           </TouchableOpacity>):null}

//       <AnimationModal visible={showAImodal} onClose={() => setshowAImodal(false)} />
//       <FileFolderModal
//         visible={opencreateuplodModal}
//         onClose={handleclosecreatefolderFileModal}
//         onSuccess={handleFolderCreationSuccess}
//         user={user}
//         folderId={folderHistory[folderHistory.length - 1]}
//       />
//       <ActionModal 
//         isVisible={actionModal} 
//         onClose={() => setActionModal(false)}
//         onSuccess={handleFolderCreationSuccess}
//      user={user}
//      item={selectedId} // ✅ Send only ID
//       />
//        <ShortingModal
//             isVisible={showDropdown} 
//             onClose={()=>setShowDropdown(false)}
//             onApply={handleSortApply}
//             sortingOptions={sortByOptions}
//             initialSorting={sortingInfo}
// />
// <WorkspaceModal
//           visible={workspacemodal}
//           user={user}
//           // folderId={currentFolderId} 
//           onClose={() => setshowworkspacemodal(false)}/>
//     </View>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.backgroundColor,
//     padding: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop:10
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   goBackButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     marginBottom: 10,
//   },
//   goBackText: {
//     marginLeft: 8,
//     fontSize: 16,
//     color: COLORS.blue,
//     fontWeight: 'bold',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignSelf: 'flex-end',
//     marginBottom: 10,
//   },
//   toggleButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#007BFF',
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     marginLeft: 8,
//   },
//   toggleButtonActive: {
//     backgroundColor: '#007BFF',
//   },
//   buttoncontainer: {
//     height: 60,
//     width: 60,
//     backgroundColor: COLORS.blue,
//     borderRadius: 50,
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   buttonText: {
//     fontSize: 30,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     marginTop: 10,
//     color: COLORS.gray,
//     fontSize: 16,
//   },
//   listContent: {
//     flexGrow: 1,
//     paddingBottom: 90,
//   },
//   icon: {
//     width: 28,
//     height: 26,
//     marginLeft: 18,
//     resizeMode: 'contain',
//   },
//   currentFolderText: {
//     padding: 10,
//     fontSize: 18,
//     fontWeight: '600',
//     color:COLORS.black
//   },
//   btn: {
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
// });

// export default Test




import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useGetFileFolderQuery } from './src/redux/reducers/services/filefolderApi';
import MediaPreview from './src/screens/preview/PreviewModal';
import { COLORS } from './src/utils/Colors';
import FileFolderModal from './src/Modaals/FileFolderModal';
import FileItem from './src/components/RenderCardListGrid';
import ActionModal from './src/Modaals/ActionModal';
import HomeHeader from './src/components/HomeHeader';
import AnimationModal from './src/Modaals/AnimationModal';
import ProgressBar from './src/components/ProgressBar';
import strings from './src/helper/Language/LocalizedStrings';
import ShortingModal from './src/Modaals/ShortingModal';
import WorkspaceModal from './src/Modaals/WorkspaceModal';
import SearchBarCompo from './src/components/SerchBarCompo';
import { debounce } from "lodash";
import { FilterData, filterData } from './src/utils/constant/FilterData';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Test = ({ navigation, worspaceActive, upladActive, filter }) => {
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const workspaces = useSelector((state) => state.workspace.workspace);
  const language = useSelector((state) => state.language.language);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [grid, setGrid] = useState(false);
  const [showAImodal, setshowAImodal] = useState(false);
  const [folderHistory, setFolderHistory] = useState([0]);
  const [localData, setLocalData] = useState([]);
  const [isFolderChanging, setIsFolderChanging] = useState(false);
  const [opencreateuplodModal, setopencreateModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [workspacemodal, setshowworkspacemodal] = useState(false);
  const [search, setSearch] = useState('');
  const [sortingInfo, setSortingInfo] = useState({
    sortBy: 'updated_at',
    sortDir: 'desc',
  });

  const sortByOptions = [
    { key: strings.Size, value: 'file_size' },
    { key: strings.Name, value: 'name' },
    { key: strings.LastModified, value: 'updated_at' },
    { key: strings.UploadDate, value: 'created_at' },
  ];
  const handleSortApply = ({ sortBy, sortDir }) => {
    setSortingInfo({ sortBy, sortDir });
  };

 // In your params object, update it to:
const params = useMemo(() => ({
  query: searchQuery, // This is correct
  pageId: 0, // Change from search?search:0 to just 0
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
  filters: selectedFilter,
}), [folderHistory, sortingInfo, workspaces, filter, searchQuery]); 

  const { data, error, isLoading, refetch } = useGetFileFolderQuery(params);

  useEffect(() => {
    if (data?.data) {
      setLocalData(data.data);
      setIsFolderChanging(false);
    }
  }, [data,searchQuery]);

  const debouncedSetSearchQuery = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500), 
    []
  );

  const toggleModalVisible = (item) => {
    setSelectedId(item);
    setActionModal(!actionModal);
  };

  const handleMediaPreview = useCallback((item) => {
    if (item.type === 'folder') {
      setIsFolderChanging(true);
      setFolderHistory(prev => [...prev, item.id]);
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
  const handleFolderCreationSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

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

  const toggleView = () => setGrid(!grid);
  const handleFilterSelect = (filter) => {
    // console.log('filter-----',filter)
    setSelectedFilter(filter);
  };
  const renderItem = useCallback(({ item }) => (
    <FileItem
      item={item}
      grid={grid}
      handleMediaPreview={() => handleMediaPreview(item)}
      onOpenModal={toggleModalVisible}
    />
  ), [grid, handleMediaPreview]);

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="folder-open-outline" size={50} color={COLORS.gray} />
      <Text style={styles.emptyText}>This folder is empty</Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
      <SearchBarCompo
        search={searchQuery} 
        setSearchQuery={(query) => {
          debouncedSetSearchQuery(query);
          setSearchQuery(query);
        }}  
      />

<View style={styles.horizontalContainer}>
        <ScrollView horizontal style={{ padding: 15 }}>
          {FilterData.map((item, id) => (
            <TouchableOpacity 
              key={id} 
              style={{
                ...styles.filterItemContainer,
                ...(selectedFilter === item.filters ? styles.selectedFilter : {})
              }}
              onPress={() => handleFilterSelect(item.filters)} 
            >
              <Image source={item.Image} style={styles.folderIcon} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

        <View style={styles.header}>

     




          {folderHistory.length > 1 ? (
            <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
              <Icon name="arrow-back" size={24} color={COLORS.blue} />
              <Text style={styles.goBackText}>{strings.goBack}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setShowDropdown(true)}>
              <Text style={styles.currentFolderText}>{strings.SORT}</Text>
              <Image source={require('./src/assets/icon/sorting.png')} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
            </TouchableOpacity>
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
            data={localData} // Use localData instead of data?.data
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

        {upladActive ? (
          <TouchableOpacity
            style={styles.buttoncontainer}
            onPress={handlecreateOpenModal}
            accessibilityLabel="Upload Button"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        ) : null}

        {worspaceActive ? (
          <TouchableOpacity style={styles.btn} onPress={() => setshowworkspacemodal(true)}>
            <Image source={require('./src/assets/arrangement.png')} tintColor={COLORS.white} />
          </TouchableOpacity>
        ) : null}

        <AnimationModal visible={showAImodal} onClose={() => setshowAImodal(false)} />
        <FileFolderModal
          visible={opencreateuplodModal}
          onClose={handleclosecreatefolderFileModal}
          onSuccess={handleFolderCreationSuccess}
          user={user}
          folderId={folderHistory[folderHistory.length - 1]}
        />
        <ActionModal
          isVisible={actionModal}
          onClose={() => setActionModal(false)}
          onSuccess={handleFolderCreationSuccess}
          user={user}
          item={selectedId}
        />
        <ShortingModal
          isVisible={showDropdown}
          onClose={() => setShowDropdown(false)}
          onApply={handleSortApply}
          sortingOptions={sortByOptions}
          initialSorting={sortingInfo}
        />
        <WorkspaceModal
          visible={workspacemodal}
          user={user}
          onClose={() => setshowworkspacemodal(false)}
        />
      </View>
    </>
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
    marginTop: 10
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
    padding: 10,
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
    height: 60,
    width: 60,
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
  icon: {
    width: 28,
    height: 26,
    marginLeft: 18,
    resizeMode: 'contain',
  },
  currentFolderText: {
    padding: 10,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black
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
  horizontalContainer: {
    flexDirection: 'row',
  },
  folderIcon: {
    height: windowHeight * 0.04, 
    width: windowWidth * 0.11, 
    marginBottom: windowHeight * 0.01,
    resizeMode: 'contain',
  },
  filterItemContainer: {
    alignItems: 'center',
    marginRight: 10, 
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
  },
  selectedFilter: {
    backgroundColor: COLORS.DriveColor,
  },
  itemContainer: {
    height: 40,
    backgroundColor: COLORS.DriveColor,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default Test;