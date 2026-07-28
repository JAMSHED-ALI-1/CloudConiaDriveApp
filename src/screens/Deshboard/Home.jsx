import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';


import { useDispatch, useSelector } from 'react-redux';


import AnimationModal from '../../Modaals/AnimationModal.jsx';
import ActionModal from '../../Modaals/ActionModal.jsx';
import FileFolderModal from '../../Modaals/FileFolderModal';

import { useLazyGetFileFolderQuery } from '../../redux/reducers/filefolder.jsx';
import strings from '../../helper/Language/LocalizedStrings.js';
import FileItem from '../../components/RenderCardListGrid.jsx';
import folderIcon from '../../assets/icon/folder.png';
import fileIcon from '../../assets/icon/file.png';
import pdfIcon from '../../assets/icons/pdf.png';
import play from '../../assets/icons/pdf.png';
import video from '../../assets/icon/video.png';
import wordIcon from '../../assets/icon/word.png';
import imageIcon from '../../assets/icon/image.png';
import All from '../../assets/icon/all.png'
import EmptyComponent from '../../components/EmptyComponent.jsx';
import Gridlist from '../../constants/Gridlist.jsx';
import { COLORS } from '../../utils/Colors.jsx';
import ShortingModal from '../../Modaals/ShortingModal.jsx';
import ImagepreviewModal from '../../Modaals/ImagepreviewModal.jsx';
import HomeHeader from '../../components/HomeHeader.jsx';
import WrapperComponent from '../../components/WrapperComponent.jsx';
import TextCompo from '../../components/TextCompo.jsx';
import WorkspaceModal from '../../Modaals/WorkspaceModal.jsx';
import Filter from '../../components/Filter.jsx';
import { accessData } from '../../utils/UserAccessData.jsx';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation.jsx';
import UpgradeButton from '../../components/UpgradeButton.jsx';
import { handleLogout } from '../../helper/Logouthelper.jsx';

const Home = ({navigation}) => {
  const workspace=useSelector((state)=>state.workspace.workspace)
  const currenntThme=useSelector((state)=>state.theme.theme)
  const [folderStack, setFolderStack] = useState([{ id: null, name: strings.Shared }]);
  const [folderLoading, setFolderLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [handleImageViewMidal,setImageViewModal]=useState(false)
  const [actionModal, setactionModal] = useState(false);
  const [workspacemodal, setshowworkspacemodal] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [showModalAi, setshowmodalAi] = useState(false);
  const [showDrodown, setshowdropdown] = useState(false);
  const dispatch=useDispatch()
     const [imageId,setImgaeid]=useState(0)


       const [hasAccess, setHasAccess] = useState(false);
      const [currentFilter, setCurrentFilter] = useState(null);
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
 useEffect(() => {
    const hasAccess = accessData(user);
    setHasAccess(hasAccess);
    console.log('User has access:', hasAccess);
  }, [user]);
    const FilderData = [
      { id: 1, Image: folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiZm9sZGVyIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMTEifV0%3D',backgroundColor:'#1a4282' },
      { id: 2, Image: fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidGV4dCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjAyIn1d' ,backgroundColor:COLORS.lightCard},
      { id: 3, Image: imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D',backgroundColor:COLORS.orenge },
      { id: 4, Image: video, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' ,backgroundColor:COLORS.green},
      { id: 5, Image: All, title:strings.ALL, filters: '',backgroundColor:COLORS.faint },
    ];
  const [fetchFiles, { data, error, isFetching }] = useLazyGetFileFolderQuery();
  if (error) {
    handleLogout(dispatch,navigation)
  }
  

  const fetchFolderData = useCallback((filter = null) => {
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
      filters: filter,
      orderBy: sortingInfo.sortBy,
      orderDir: sortingInfo.sortDir,
    }).finally(() => setFolderLoading(false));
  }, [currentFolderId,sortingInfo, fetchFiles,workspace]);

  useEffect(() => {
    fetchFolderData();
  }, [currentFolderId,workspace]);
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
  const handleFilterSelection = (filter) => {
    setCurrentFilter(filter); // Update the current filter
    fetchFolderData(filter); // Fetch data based on the selected filter
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
    <>
   
    <HomeHeader
    user={user}
    handleIconPress={() => setshowmodalAi(true)}
    handlecreateOpenModal={() => setShowmodal(true)}
    />
    <WrapperComponent>
    <View style={{ flex: 1, paddingHorizontal:10 }}>
    <View style={{height:110,width:'100%'}}>

<Filter
       FilterData={FilderData}
       selectedFilter={currentFilter}
       handleFilterSelect={handleFilterSelection}
       />
</View>
   
     
      <View style={{
            // borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>

      {folderStack.length > 1 ? (
        <TouchableOpacity onPress={handleBackPress} style={{ marginBottom: 10 }}>
          <TextCompo style={{ ...styles.currentFolderText,color:currenntThme === 'dark' ? COLORS.white : COLORS.black,fontSize:16}}>
            ⬅️  {strings.Backto} {folderStack[folderStack.length - 2]?.name || strings.HOME}
          </TextCompo>
        </TouchableOpacity>
      ):<TextCompo style={{...styles.currentFolderText,color:currenntThme === 'dark' ? COLORS.white : COLORS.black}}>{strings.HOME}</TextCompo>}
       
           
            
      <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>

<TouchableOpacity
  style={{flexDirection: 'row', alignItems: 'center'}}
  onPress={() => setshowdropdown(true)}>
    <Text style={{...styles.currentFolderText,color:currenntThme === 'dark' ? COLORS.white : COLORS.black}}>{strings.SORT}</Text>
  {/* <TextCompo >{strings.SORT}</TextCompo> */}
  <Image
    source={require('../../assets/icon/sorting.png')}
    // source={require('./src/assets/icon/sorting.png')}
    style={{height: 25, width: 25, resizeMode: 'contain', tintColor:currenntThme==='dark'?'white':'black'}}
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
  ) : hasAccess ? (
    <FlatList
      data={data?.data || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={isGrid ? 2 : 1}
      key={isGrid ? 'list' : 'grid'}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={(<EmptyComponent text={strings.THIS_FIEL_FOLDERISEMPTY}/>)}
      // contentContainerStyle={styles.listContent}
    />
  ) : (
    <>
    <Text style={{fontSize:16,fontWeight:'500',textAlign:"center",color:COLORS.red}}>
{[strings.Warning_Yourdemoaccounthasexpired, strings.Purchasethepackageyouchoosenowtocontinueyourlife, strings.whichismadeeasierbyConiaCloud].join(' ')}
</Text>
    <SubscriptionAnimation />
<UpgradeButton/>
  </>
  )}

 <TouchableOpacity style={styles.btn} onPress={() => setshowworkspacemodal(true)}>
        <Image source={require('../../assets/arrangement.png')} tintColor={COLORS.white} />
      </TouchableOpacity>

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

      <WorkspaceModal 
      visible={workspacemodal} 
      user={user} 
      onClose={() => setshowworkspacemodal(false)} />
    </View>
   
    </WrapperComponent>
     </>
  );
};


const styles=StyleSheet.create({

    currentFolderText: {
        //  paddingHorizontal: 10,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        alignSelf: 'center',
      },
      backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
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
  
})


export default Home
