import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  action,
} from 'react-native';
import {useGetFileEntriesQuery} from '../../redux/reducers/services/searchAndFilter';
import SearchBarCompo from '../../components/SerchBarCompo';
import {debounce} from 'lodash';
import {useSelector} from 'react-redux';
import {FilterData, filterData} from '../../utils/constant/FilterData';
import {COLORS} from '../../utils/Colors';
import FileItem from '../../components/RenderCardListGrid';
import strings from '../../helper/Language/LocalizedStrings';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMediaPreview} from '../../components/FileSystemComponent';
import Gridlist from '../../constants/Gridlist';
import ActionModal from '../../Modaals/ActionModal';
import WorkspaceModal from '../../Modaals/WorkspaceModal';
import FileFolderModal from '../../Modaals/FileFolderModal';
import {useGetFileFolderQuery} from '../../redux/reducers/services/filefolderApi';
import HomeHeader from '../../components/HomeHeader';
import AnimationModal from '../../Modaals/AnimationModal';
import Filter from '../../components/Filter';
import ShortingModal from '../../Modaals/ShortingModal';
import ProgressBar from '../../components/ProgressBar';
import Trashremove from '../../Modaals/Trashremove';
import { accessData } from '../../utils/UserAccessData';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
import UpgradeButton from '../../components/UpgradeButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CommonCompo = ({
  folderId,
  navigation,
  extraParams,
  upladActive,
  trash,
  home,
  Drive,
  action,
  screenType,
  workspace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [folderHistory, setFolderHistory] = useState([0]);
  const [localData, setLocalData] = useState([]);
  const [isFolderChanging, setIsFolderChanging] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [grid, setGrid] = useState(true);
  const user = useSelector(state => state.auth.user);
  const language = useSelector(state => state.language.language);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [workspacemodal, setshowworkspacemodal] = useState(false);
  const [opencreateuplodModal, setopencreateModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [showModalAi, setshowmodalAi] = useState(false);
  const [showmodalTrash, setShowmodalTrash] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
  // console.log(folderHistory,'---------->>>>>')
  const handleSortApply = ({sortBy, sortDir}) => {
    setSortingInfo({sortBy, sortDir});
  };
  // Debounced function to reduce API calls
  const debouncedSetSearchQuery = useCallback(
    debounce(query => {
      setSearchQuery(query);
    }, 500),
    [],
  );

  useEffect(() => {
    const hasAccess = accessData(user);
    setHasAccess(hasAccess);
    console.log('User has access:', hasAccess);
  }, [user]);


  const params = useMemo(
    () => ({
      query: searchQuery,
      pageId: 0,
      folderId: folderHistory[folderHistory.length - 1],
      page: currentPage,
      workspaceId: workspaces || 0,
      per_page: 100,
      orderBy: sortingInfo.sortBy,
      orderDir: sortingInfo.sortDir,
      filters: selectedFilter,
      ...extraParams,
    }),
    [folderHistory, sortingInfo, workspaces, selectedFilter, searchQuery,currentPage],
  );

  const {data, error, isLoading, refetch} = useGetFileFolderQuery(params);
  if (error) {
    console.log('Error:', error);
  
    // Handle specific error status (e.g., 403)
    if (error.status  === 403 || error) {
      console.log('Access forbidden. Navigating to login...');
      navigation.push('Login');  // Assuming `navigation` is available
    } else {
      console.log('An error occurred:', error.message);  // Log any other error messages
    }
  }

  useEffect(() => {
    if (data?.data) {
      setLocalData(prev =>(currentPage === 1 ? data.data : [...prev, ...data.data]));
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);

      setIsFolderChanging(false);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [searchQuery, folderHistory, selectedFilter, params]);

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
  const handleFilterSelect = async filter => {
    console.log('filter', filter);
    await setSelectedFilter(filter);
  };
  //   const toggleModalVisible = (item) => {
  //     setSelectedId(item);
  //     setActionModal(!actionModal);
  //   };
  const toggleModalVisible = item => {
    setSelectedId(item);

    // Set the modal visibility based on the screenType
    switch (screenType) {
      case 'home':
        setSelectedId(item);
        setActionModal(!actionModal);
        break;
      case 'trash':
        setSelectedId(item);
        setShowmodalTrash(true);

        break;

      default:
        null;
    }
  };

  const loadMoreData = () => {
    if (!isLoadingMore && data?.next_page) {
      setIsLoadingMore(true);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };


  const handleMediaPreview = useMediaPreview(navigation, user);
  const onItemPress = item => {
    // If it's a folder, handle folder navigation
    if (item.type === 'folder') {
      setIsFolderChanging(true);
      // Your folder navigation logic
      // setSelectedId(item);
      //   setShowmodalTrash(true);
      setFolderHistory(prev => [...prev, item.id]);
    } else {
      // Preview the file
      handleMediaPreview(item);
    }
  };
  const renderItem = useCallback(
    ({item}) => (
      <FileItem
        item={item}
        grid={grid}
        handleMediaPreview={() => onItemPress(item)}
        onOpenModal={toggleModalVisible}
      />
    ),
    [grid, handleMediaPreview],
  );
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="folder-open-outline" size={50} color={COLORS.gray} />
      <Text style={styles.emptyText}>This folder is empty</Text>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      <HomeHeader
        user={user}
        handleIconPress={() => setshowmodalAi(true)}
        handlecreateOpenModal={handlecreateOpenModal}
      />
      <View style={{flex: 1, padding: 10}}>
        <View style={styles.horizontalContainer}>
          {/* <Filter
       FilterData={FilterData}
       selectedFilter={selectedFilter}
       handleFilterSel
       ect={handleFilterSelect}
       /> */}
          <View style={{paddingBottom: 15}}>
            <ProgressBar />
          </View>
        </View>

        <SearchBarCompo
          search={searchQuery}
          setSearchQuery={query => {
            debouncedSetSearchQuery(query);
            setSearchQuery(query);
          }}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {folderHistory.length > 1 ? (
            <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
              <Icon name="arrow-back" size={24} color={COLORS.blue} />
              <Text style={styles.goBackText}>{strings.goBack}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <Gridlist
            toggleView={toggleView}
            grid={grid}
            showshort={true}
            setShowDropdown={() => setShowDropdown(true)}
          />
        </View>
        {isLoading && (
          <ActivityIndicator size="large" style={{marginTop: 20}} />
        )}

        {error && (
          <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
            Error fetching data
          </Text>
        )}
        {isFolderChanging || isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.blue} />
          </View>
        ) :  hasAccess ?(
          <FlatList
            data={localData} // Use localData instead of data?.data
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            key={grid ? 'grid' : 'list'}
            numColumns={grid ? 2 : 1}
            onRefresh={refetch}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyListComponent}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={isLoadingMore ? <ActivityIndicator size="small" color="#000" /> : null}
          />
        ): (
          <>
            <Text style={{fontSize:16,fontWeight:'500',textAlign:"center",color:COLORS.red}}>
  {[strings.Warning_Yourdemoaccounthasexpired, strings.Purchasethepackageyouchoosenowtocontinueyourlife, strings.whichismadeeasierbyConiaCloud].join(' ')}
</Text>
            <SubscriptionAnimation />
<UpgradeButton/>
          </>
        )}

        {workspace ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setshowworkspacemodal(true)}>
            <Image
              source={require('../../assets/arrangement.png')}
              tintColor={COLORS.white}
            />
          </TouchableOpacity>
        ) : null}
        <FileFolderModal
          visible={opencreateuplodModal}
          onClose={handleclosecreatefolderFileModal}
          onSuccess={handleFolderCreationSuccess}
          user={user}
          folderId={folderHistory[folderHistory.length - 1]}
        />
        <AnimationModal
          visible={showModalAi}
          onClose={() => setshowmodalAi(false)}
        />
        <ShortingModal
          isVisible={showDropdown}
          onClose={() => setShowDropdown(false)}
          onApply={handleSortApply}
          sortingOptions={sortByOptions}
          initialSorting={sortingInfo}
        />

        <ActionModal
          // isVisible={modalState.actionModal}
          // onClose={() => setModalState((prevState) => ({ ...prevState, actionModal: false }))}
          // onSuccess={handleFolderCreationSuccess}
          // user={user}
          // item={selectedId}
          isVisible={actionModal}
          onClose={() => setActionModal(false)}
          user={user}
          item={selectedId}
          onSuccess={handleFolderCreationSuccess}
        />

        {/* <WorkspaceModal
    isVisible={modalState.workspaceModal}
    onClose={() => setModalState((prevState) => ({ ...prevState, workspaceModal: false }))}
  /> */}

        <WorkspaceModal
          visible={workspacemodal}
          user={user}
          // folderId={currentFolderId}
          onClose={() => setshowworkspacemodal(false)}
        />

{/* <Trashremove
          visible={showmodalTrash}
          onSuccess={handleFolderCreationSuccess}
          user={user}
          onClose={() => setShowmodalTrash(false)}
          folderId={selectedId}
        /> */}
        <Trashremove
        visible={showmodalTrash}
        onSuccess={handleFolderCreationSuccess}
        user={user}
        onClose={() => setShowmodalTrash(false)}
        folderId={selectedId}
        />
        
      </View>
    </View>
  );
};

export default CommonCompo;

const styles = StyleSheet.create({
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
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 5,
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
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
});
