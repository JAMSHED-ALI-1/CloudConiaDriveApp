
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
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Shared = () => {
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector(state => state.workspace.workspace);
  
  const [isLoading, setIsLoading] = useState(true);
  const [driveData, setDriveData] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({
    pageId: 'shares',
    folderId: null,
    folderDetails: null,
    breadcrumbs: []
  });
  const language = useSelector((state) => state.language.language);
  const navigation=useNavigation()
  const [folderStack, setFolderStack] = useState([{ id: null, name: strings.Shared }]);
  const [refreshing, setRefreshing] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionModal,setactionModal]=useState(false)
  // To track folder navigation
// const [currentFolderId, setCurrentFolderId] = useState(null); // To track the active folder ID

  const handleGridListToggle = () => {
    setIsGrid((isGrid)=>!isGrid);
  };
  const toggleModalVisible = (item) => {
    setSelectedItem(item); 
    setactionModal(!actionModal);
  };
  const FilderData = [
    { id: 1, Image: folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiZm9sZGVyIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMTEifV0%3D' },
    { id: 2, Image: fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidGV4dCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjAyIn1d' },
    { id: 3, Image: imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D' },
    { id: 4, Image: video, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' },
  ];





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
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={styles.breadcrumbText}>
          {currentFolder.breadcrumbs.map(folder => folder.name).join(' > ') || strings.Shared}
        </Text>
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
    
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg',].includes(item.extension.toLowerCase())) {
      // Navigate to ImageViewer if the item is an image
      navigation.navigate('ImageViewer',{
        filePath: item,
        user: user,
      });
      
    } 
    else if (item.type === 'pdf') {
      // Navigate to ImageViewer if the item is an image
      navigation.navigate('PdfView',{
        filePath: item,
        user: user,
      });
      
    } else if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(item.extension)){
      navigation.navigate('VideoPreview', {
        filePath: item,
        user: user, 
      });
    } else if (['mp3', 'wav', 'aac', 'flac'].includes(item.extension)){
      navigation.navigate('AudioPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['doc', 'docx'].includes(item.extension)){
      navigation.navigate('WordPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['pptx','ppt','odp'].includes(item.extension)){
      navigation.navigate('PptPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['xls','xlsx','csv','ods'].includes(item.extension)){
      navigation.navigate('SpreadsheetPreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['txt'].includes(item.extension)){
      navigation.navigate('TextFilePreview', {
        filePath: item,
        user: user, 
      });
    }
    else if (['zip','tar','rar','exe','app','apk'].includes(item.extension)){
      navigation.navigate('Zipapkpreview', {
        filePath: item,
        user: user, 
      });
    }else {
      console.log('File clicked:',);
    }
  }, [navigation, user, folderStack]);

  const renderItemList = useCallback(({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item,navigation, user, folderStack)}>
 
      <View style={styles.iconContainer}>
      <Image 
        source={getItemIcon(item)} 
        style={styles.icon} 
        resizeMode="contain" 
      />
      </View>
      <View style={{left:10}}>
      <Text style={[styles.itemText,]}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}</Text>
      <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </View>
      <TouchableOpacity
           onPress={() => toggleModalVisible(item)}
          style={{position:'absolute',right:10}}>
            <Image source={require('../../assets/MoreOption.png')} style={[{ height: 20, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  ),[handleItemPress]);

  const renderItemGrid = useCallback(({ item }) => (
    
    <TouchableOpacity style={styles.grid} onPress={() => handleItemPress(item)}>
      <View>

    
      <View style={styles.iconContainer}>
      <Image 
        source={getItemIcon(item)} 
        style={styles.icon} 
        resizeMode="contain" 
      />
      </View>
      <Text style={styles.itemText}>{item.name.length > 13 ? `${item.name.substring(0, 13)}...` : item.name}</Text>
      <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </View>
      <TouchableOpacity
           onPress={() => toggleModalVisible(item)}
          >
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 20, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  ),[handleItemPress]);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>

   
    <View style={styles.container}>
        <CustomHeader
          
          right={true}
          grid={true}
          title={strings.Shared}
          ViewType={isGrid}  // Pass the view type state
          hadleGidList={handleGridListToggle}
        />
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
<View style={{width:'95%',alignSelf:'center'}}>

<ProgressBar/>
</View>
{renderBreadcrumbs()}
      {/* {folderStack.length > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
          <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
        </TouchableOpacity>
      )} */}
      {/* <Text style={styles.currentFolderText}>{strings.CurrentFolder}: {folderStack[folderStack.length - 1].name}</Text> */}
      {isLoading ? (
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
            />
    </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    padding:10
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
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
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
