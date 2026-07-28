
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, SafeAreaView ,Dimensions, TextInput} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { COLORS } from '../../utils/Colors';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL, fileColorCode } from '../../utils/constant/settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { timeAgo } from '../../helper/functionHelper';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import folderIcon from '../../assets/icon/folder.png';
import fileIcon from '../../assets/icon/file.png';
import pdfIcon from '../../assets/icons/pdf.png';
import play from '../../assets/icons/pdf.png';
import video from '../../assets/icon/video.png';
import wordIcon from '../../assets/icon/word.png';
import imageIcon from '../../assets/icon/image.png';

import ActionModal from '../../Modaals/ActionModal';
import strings from '../../helper/Language/LocalizedStrings';
import getItemIcon from '../../constants/GetItemIcon';
import ProgressBar from '../../components/ProgressBar';
import UnshareModal from '../../Modaals/UnshareModal';
import { accessData } from '../../utils/UserAccessData';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
import FileItem from '../../components/RenderCardListGrid';
import Gridlist from '../../constants/Gridlist';
import HomeHeader from '../../components/HomeHeader';
import FileFolderModal from '../../Modaals/FileFolderModal';
import AnimationModal from '../../Modaals/AnimationModal';
import UpgradeButton from '../../components/UpgradeButton';
import EmptyComponent from '../../components/EmptyComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagepreviewModal from '../../Modaals/ImagepreviewModal';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Shared = () => {
 const user = useSelector(state => state.auth.user);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [driveData, setDriveData] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({
    pageId: 'shares',
    folderId: null,
    folderDetails: null,
    breadcrumbs: []
  });
  const language = useSelector((state) => state.language.language);
  const currenntThme=useSelector((state)=>state.theme.theme)
  const navigation=useNavigation()
  const [folderStack, setFolderStack] = useState([{ id: null, name: strings.Shared }]);
  const [refreshing, setRefreshing] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionModal,setactionModal]=useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [opencreateuplodModal, setopencreateModal] = useState(false);
  const [showModalAi, setshowmodalAi] = useState(false);
   const [handleImageViewMidal,setImageViewModal]=useState(false)
              const [imageId,setImgaeid]=useState(0)
  // To track folder navigation
// const [currentFolderId, setCurrentFolderId] = useState(null); // To track the active folder ID

  const handleGridListToggle = () => {
    setIsGrid((isGrid)=>!isGrid);
  };
  const handlecreateOpenModal = () => setopencreateModal(true);
  const handleclosecreatefolderFileModal = () => setopencreateModal(false);
  const toggleModalVisible = (item) => {
    setSelectedItem(item); 
    setactionModal(!actionModal);
  };
  useEffect(() => {
    const hasAccess = accessData(user);
    setHasAccess(hasAccess);
    console.log('User has access:', hasAccess);
  }, [user]);






  const currentFolderId = useMemo(() => 
    folderStack[folderStack.length - 1].id, 
    [folderStack]
  );


  const fetchDriveData = useCallback(async (folderParams = {},filter = null) => {
    try {
      setIsLoading(true);
     
      const { 
        pageId = 'shares',
        
        folderId = null, 
        workspaceId = workspaces || 0 
      } = folderParams;

      const { data } = await axios.get(`${baseURL}/drive/file-entries`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId: search?search:pageId,
          ...(folderId && { folderId }),
          filters: {...filter},
          workspaceId,
          orderBy: 'updated_at',
          orderDir: 'desc',
          page: 1,
          per_page: 100,
          sharedOnly: pageId === 'shares'
        }
      });
      setDriveData(data.data);
    } catch (error) {
      console.error('Drive Fetch Error:', error);
      // if()
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaces,search,, currentFolderId, ]);

  useEffect(() => {
    fetchDriveData({
      pageId: currentFolder.pageId,
      folderId: currentFolder.folderId,
    });
  }, [fetchDriveData, currentFolder.pageId, currentFolder.folderId]);

  const handleFolderClick = (folder) => {
    setCurrentFolder(prevState => ({
      pageId: folder.hash, 
      folderId: folder.hash,
      folderDetails: folder,
      breadcrumbs: [...prevState.breadcrumbs, folder]
    }));
  };


  const handleFilterSelection = (filter) => {
    setCurrentFilter(filter); // Update the current filter
    fetchDriveData(filter); // Fetch data based on the selected filter
  };
  
  const handleFolderCreationSuccess = () => {
    fetchDriveData()
  };

  useEffect(() => {
    fetchDriveData();
  }, [ currentFolderId, user,workspaces]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDriveData();
    setRefreshing(false);
  }, [fetchDriveData]);
  const handleGoBack = () => {
    setCurrentFolder(prevState => {
      const newBreadcrumbs = prevState.breadcrumbs.slice(0, -1);
      const parentFolder = newBreadcrumbs[newBreadcrumbs.length - 1];

      return {
        pageId: parentFolder ? parentFolder.hash : 'shares',
        folderId: parentFolder ? parentFolder.hash : null,
        folderDetails: parentFolder || null,
        breadcrumbs: newBreadcrumbs
      };
    });
  };
 
  const renderBreadcrumbs = () => {
    return (
      <View style={styles.breadcrumbContainer}>
        {currentFolder.breadcrumbs.length > 0 && (
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={currenntThme==='dark'?COLORS.white:COLORS.black}/>
          </TouchableOpacity>
        )}
        <Text style={{...styles.breadcrumbText,fontSize:16,color:currenntThme==='dark'?COLORS.white:COLORS.black}}>
          {currentFolder.breadcrumbs.map(folder => folder.name).join(' > ') || strings.Shared}
        </Text>
        <Gridlist
            toggleView={handleGridListToggle}
            grid={isGrid}
            setShowDropdown={() => setShowDropdown(true)}
          />
      </View>
    );
  };

  const handleItemPress = useCallback((item) => {
    if (item.type === 'folder') {
      setCurrentFolder(prevState => ({
        pageId: item.hash, // Dynamically use folder's hash as pageId
        folderId: item.hash,
        folderDetails: item,
        breadcrumbs: [...prevState.breadcrumbs, item]
      }));
    
    }else if (
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
   
  }, [navigation, user, folderStack]);







  const renderItem = useCallback(
    ({item}) => (
      <FileItem
        item={item}
        grid={isGrid}
        handleMediaPreview={() => handleItemPress(item)}
        onOpenModal={toggleModalVisible}
        user={user}
        // handleMediaPreview={() => handleItemClick(item)}
        // onOpenModal={toggleModalVisible}
        workspace={workspaces}
      />
    ),
    [isGrid, handleItemPress],
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:currenntThme==='dark'?COLORS.black:COLORS.backgroundColor}}>

<HomeHeader
        user={user}
        handleIconPress={() => setshowmodalAi(true)}
        handlecreateOpenModal={handlecreateOpenModal}
      />
   
    <View style={styles.container}>
        {/* <CustomHeader
          
          right={true}
          grid={true}
          title={strings.Shared}
          ViewType={isGrid}  // Pass the view type state
          hadleGidList={handleGridListToggle}
        /> */}
         {/* <View style={styles.inputContainer}>
            <TouchableOpacity>
              <Image source={require('../../assets/Search.png')} style={styles.leftImage} />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Search" />
            <TouchableOpacity>
              <Image source={require('../../assets/Filter.png')} style={styles.rightImage} />
            </TouchableOpacity>
          </View>
<View style={styles.folderContainer}>
  {FilderData.map(item => (
    <View key={item.id} style={styles.folderItem}>
      <TouchableOpacity 
        style={[
          styles.filtercontainer,
          currentFilter === item.filters && styles.selectedFilter,
        ]}
        onPress={() => handleFilterSelection(item.filters)}
      >
        <Image source={item.Image} style={styles.folderIcon} />
      </TouchableOpacity>
      <Text style={styles.folderTitle}>{item.title}</Text>
    </View>
  ))}
</View> */}
<View style={{width:'100%',}}>

{/* <ProgressBar/> */}
</View>

{renderBreadcrumbs()}

      {/* {folderStack.length > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
          <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
        </TouchableOpacity>
      )} */}
      {/* <Text style={styles.currentFolderText}>{strings.CurrentFolder}: {folderStack[folderStack.length - 1].name}</Text> */}
      {/* {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primeryBlue} />
      ) : (
        <FlatList
          data={driveData}
          renderItem={isGrid ?   renderItemList: renderItemGrid}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<View style={{flex:1,alignItems:'center'}}>
          <Text style={styles.emptyText}>This folder is empty|| or API Problem From BackEnd Token Expired</Text>
        </View>}
            numColumns={isGrid ? 1 : 2}// Number of columns for grid or list view
          onRefresh={onRefresh}
          refreshing={refreshing}
          key={isGrid ?  'list':'grid' } // Key to re-render FlatList on viewType change
        />
       
      )} */}
  

{isLoading ? (
          <ActivityIndicator size="large" color={COLORS.blue} />
        ) : hasAccess ? ( // Corrected: Moved hasAccess check outside the extra curly braces
          <FlatList
            data={driveData}
            // renderItem={isGrid ? renderItemList:renderItemGrid}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
           
            numColumns={isGrid ? 2 : 1}
            onRefresh={onRefresh}
            refreshing={refreshing}
            key={isGrid ?  'list':'grid'} 
          
         
          
          
            
        
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={(<EmptyComponent text={strings.THIS_FIEL_FOLDERISEMPTY}/>)}
            contentContainerStyle={styles.listContent}
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
      {/* <ActionModal 
            isVisible={actionModal} 
            onClose={()=>setactionModal(false)}
            user={user}
            item={selectedItem}/> */}
            <UnshareModal
             visible={actionModal}
             user={user}
             folderId={selectedItem} 
             onClose={() => setactionModal(false)}
             onSuccess={handleFolderCreationSuccess}
            />
               <FileFolderModal
          visible={opencreateuplodModal}
          onClose={handleclosecreatefolderFileModal}
          onSuccess={handleFolderCreationSuccess}
          user={user}
          folderId={selectedItem}
        />
        <AnimationModal
          visible={showModalAi}
          onClose={() => setshowmodalAi(false)}
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
    paddingHorizontal:10
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    marginLeft: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
  currentFolderText: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: '1.5%',
    borderWidth: 1,
    backgroundColor:COLORS.DriveColor,
    borderRadius:10,
    
  },
  grid: {
    width: '46%',
    padding: 8,
    margin: '1.5%',
  backgroundColor:COLORS.DriveColor,
    borderRadius:10,
    borderWidth:0.5,
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:"space-between"
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
    color:COLORS.boldText,
    fontWeight:'600'
    // textAlign: 'center',
  },
  rightImage: {
    width: 24,
    height: 24,
  },
  moreicon: {
    height: 25,
    width: 10,
    resizeMode: 'contain',
    position:'absolute',
    right:0
    
  },
  emptyText:{
    padding:10,
    textAlign:'center',
    marginTop:30},
    folderContainer: {
      flexDirection: 'row',
      marginTop: windowHeight * 0.02,
    },
    folderItem: {
      alignItems: 'center',
      // marginBottom: 20,
      padding: 14,
      // backgroundColor:'red',
      // // width: '45%',
      // margin:10
    },
    folderIcon: {
      height: windowHeight * 0.05, // Adjust folder icon size based on screen height
      width: windowWidth * 0.12, // Adjust width for responsiveness
      marginBottom: windowHeight * 0.01,
      resizeMode: 'contain',
      // marginBottom: 10,
      // backgroundColor:'red',
      // width: '45%',
    },
    folderTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#071625',
    },
    filtercontainer: {
      padding: 8,
      backgroundColor: '#D7EFFF',
      borderRadius: 10,
    },
    statusContainer: {
      alignItems: "center",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        width: '95%',
        alignSelf: 'center',
        marginTop: 40,
      },
      leftImage: {
        width: 24,
        height: 24,
        marginRight: 10,
      },
      input: {
        flex: 1,
        height: '100%',
      },
     
      breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        // backgroundColor: '#FFFFFF',
        // borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        justifyContent:'space-between'
      },
      backButton: {
        marginRight: 10,
      },
      breadcrumbText: {
        fontSize: 18,
        fontWeight: '600',
        color:COLORS.black
      },
      folderDetailsContainer: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      folderDetailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      folderDetailsContent: {
        fontSize: 14,
      },
      userSection: {
        marginTop: 10,
      },
      userItem: {
        marginLeft: 10,
      },
      listContainer: {
        padding: 10,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      itemContainer: {
        flex: 1,
        alignItems: 'center',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      folderMetadata: {
        marginTop: 5,
        backgroundColor: '#F0F0F0',
        padding: 3,
        borderRadius: 4,
      },
      folderMetadataText: {
        fontSize: 10,
        color: '#666',
      },
      image: {
        width: '100%',
        aspectRatio: 1,
      },
      fileName: {
        marginTop: 5,
        textAlign: 'center',
        fontSize: 12,
      },
      icon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white, // Apply a tint color if applicable
      },
});


export default Shared
