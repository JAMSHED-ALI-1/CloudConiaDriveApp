import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useLazyGetFileFolderQuery } from './src/redux/reducers/filefolder';
import strings from './src/helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import FileItem from './src/components/RenderCardListGrid';
import HomeHeader from './src/components/HomeHeader';
import AnimationModal from './src/Modaals/AnimationModal';
import ActionModal from './src/Modaals/ActionModal.jsx';
import FileFolderModal from './src/Modaals/FileFolderModal';
import EmptyComponent from './src/components/EmptyComponent';
import Gridlist from './src/constants/Gridlist';
import { COLORS } from './src/utils/Colors';
import ShortingModal from './src/Modaals/ShortingModal';
import ImagepreviewModal from './src/Modaals/ImagepreviewModal';

const FileFolderScreen = ({navigation}) => {
  const workspace=useSelector((state)=>state.workspace.workspace)
  const [folderStack, setFolderStack] = useState([{ id: null, name: strings.HOME }]);
  const [folderLoading, setFolderLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
      const [handleImageViewMidal,setImageViewModal]=useState(false)
    const [actionModal, setactionModal] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [showModalAi, setshowmodalAi] = useState(false);
    const [showDrodown, setshowdropdown] = useState(false);
     const [imageId,setImgaeid]=useState(0)
  const currentFolderId = folderStack[folderStack.length - 1]?.id;
  const user = useSelector(state => state.auth.user);
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
  const [fetchFiles, { data, error, isFetching }] = useLazyGetFileFolderQuery();

  const fetchFolderData = useCallback(() => {
    setFolderLoading(true);
    fetchFiles({
      pageId: 0,
      folderId: currentFolderId,
      sharedOnly: false,
      starredOnly: false,
      recentOnly: false,
      deletedOnly: false,
      query: '',
      workspaceId: workspace,
      orderBy: 'updated_at',
      orderDir: 'desc',
      page: 1,
      filters: '',
      orderBy: sortingInfo.sortBy,
      orderDir: sortingInfo.sortDir,
    }).finally(() => setFolderLoading(false));
  }, [currentFolderId,sortingInfo, fetchFiles]);

  useEffect(() => {
    fetchFolderData();
  }, [currentFolderId]);
  const handleSortApply = ({ sortBy, sortDir }) => {
    setSortingInfo({ sortBy, sortDir });  // Update sorting info
    fetchFolderData();  // Fetch folder data with the new sorting criteria
    console.log('Sort applied:', sortBy, sortDir);
  };
  
  const handleItemPress = useCallback((item) => {
    if (item.type === 'folder') {
      setFolderStack(prev => [...prev, { id: item.id, name: item.name }]);
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
  }, [navigation, user, folderStack]);
  const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };
  const handleBackPress = useCallback(() => {
    if (folderStack.length > 1) {
      setFolderStack(prev => prev.slice(0, -1));
    }
  }, [folderStack]);

  const handleFolderCreationSuccess = () => {
    fetchFolderData(); // refresh after new folder created
  };

  const renderItem = useCallback(
    ({ item }) => (
      <FileItem
        item={item}
        grid={isGrid}
        user={user}
        onOpenModal={toggleModalVisible}
        handleMediaPreview={() => handleItemPress(item)}
        workspace={0}
      />
    ),
    [isGrid, handleItemPress]
  );
  const toggleModalVisible = item => {
    setSelectedItem(item);
    setactionModal(!actionModal);
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading files: {error?.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>
       <HomeHeader
        user={user}
        handleIconPress={() => setshowmodalAi(true)}
        handlecreateOpenModal={() => setShowmodal(true)}
      />

    <View style={{ flex: 1, padding: 10 }}>
     
      <View style={{
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

      {folderStack.length > 1 && (
        <TouchableOpacity onPress={handleBackPress} style={{ marginBottom: 10 }}>
          <Text style={{ color: 'blue' }}>
            ⬅️  {strings.Backto} {folderStack[folderStack.length - 2]?.name || strings.HOME}
          </Text>
        </TouchableOpacity>
      )}
       {folderStack.length <= 1 && (
              <Text style={styles.currentFolderText}>{strings.HOME}</Text>
            )}
      <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>

<TouchableOpacity
  style={{flexDirection: 'row', alignItems: 'center'}}
  onPress={() => setshowdropdown(true)}>
  <Text style={styles.currentFolderText}>{strings.SORT}</Text>
  <Image
    // source={require('../../assets/icon/sorting.png')}
    source={require('./src/assets/icon/sorting.png')}
    style={{height: 25, width: 25, resizeMode: 'contain'}}
  />
</TouchableOpacity>
<Gridlist
  toggleView={handleGridListToggle}
  grid={isGrid}
/>
</View>
      </View>
{
  (folderLoading || isFetching) ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  ) : (
    <FlatList
      data={data?.data || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={isGrid ? 2 : 1}
      key={isGrid ? 'list' : 'grid'}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyComponent}
      // contentContainerStyle={styles.listContent}
    />
  )
}


      <AnimationModal
        visible={showModalAi}
        onClose={() => setshowmodalAi(false)}
      />

      <FileFolderModal
        visible={showmodal}
        user={user}
        folderId={currentFolderId}
        onClose={() => setShowmodal(false)}
        onSuccess={handleFolderCreationSuccess}
      />
       <ShortingModal
          isVisible={showDrodown}
          onClose={() => setshowdropdown(false)}
          onApply={handleSortApply}
          sortingOptions={sortByOptions}
          initialSorting={sortingInfo}
        />
         <ActionModal
          isVisible={actionModal}
          onClose={() => setactionModal(false)}
          user={user}
          item={selectedItem}
          onSuccess={handleFolderCreationSuccess}
        />
         <ImagepreviewModal
        visible={handleImageViewMidal}
        workspace={workspace}
        onClose={()=>setImageViewModal(false)}
        imageId={imageId}
        user={user}
        />
    </View>
    </SafeAreaView>
  );
};

export default FileFolderScreen;
const styles=StyleSheet.create({

    currentFolderText: {
        //  paddingHorizontal: 10,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.black,
      },
      backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      },
  
})
