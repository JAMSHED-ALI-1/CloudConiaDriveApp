import React, { useCallback, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { baseURL } from './src/utils/constant/settings';

const DriveFileBrowser = () => {
  const { user, workspaces } = useSelector(state => ({
    user: state.auth.user,
    workspaces: state.workspace.workspace
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [driveData, setDriveData] = useState([]);
  const [layout, setLayout] = useState('grid'); // Toggle between 'list' and 'grid'
  const [currentFolder, setCurrentFolder] = useState({
    pageId: 'shares',
    folderId: null,
    folderDetails: null,
    breadcrumbs: []
  });

  const fetchDriveData = useCallback(async (folderParams = {}) => {
    try {
      setIsLoading(true);
      const { pageId = 'shares', folderId = null, workspaceId = workspaces || 0 } = folderParams;

      const { data } = await axios.get(`${baseURL}/drive/file-entries`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId,
          ...(folderId && { folderId }),
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
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaces]);

  useEffect(() => {
    fetchDriveData({
      pageId: currentFolder.pageId,
      folderId: currentFolder.folderId,
    });
  }, [fetchDriveData, currentFolder]);

  const handleFolderClick = (folder) => {
    setCurrentFolder(prevState => ({
      pageId: folder.hash,
      folderId: folder.hash,
      folderDetails: folder,
      breadcrumbs: [...prevState.breadcrumbs, folder]
    }));
  };

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

  const toggleLayout = () => setLayout(prev => (prev === 'grid' ? 'list' : 'grid'));

  const renderBreadcrumbs = () => (
    <View style={styles.breadcrumbContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.breadcrumbText}>
        {currentFolder.breadcrumbs.map(folder => folder.name).join(' > ') || 'Shared Files'}
      </Text>
      <TouchableOpacity onPress={toggleLayout} style={styles.layoutToggle}>
        <Icon name={layout === 'grid' ? 'view-list' : 'grid-view'} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderItemList = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => handleFolderClick(item)}>
      <Icon name={getItemIcon(item)} size={40} color="#666" style={styles.listIcon} />
      <View style={styles.listDetails}>
        <Text style={styles.fileName}>
          {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
        </Text>
        <Text style={styles.fileMetadata}>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Icon name="more-vert" size={20} color="#666" style={styles.listMoreIcon} />
    </TouchableOpacity>
  );

  const renderItemGrid = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => handleFolderClick(item)}>
      <Icon name={getItemIcon(item)} size={50} color="#2196F3" />
      <Text style={styles.fileName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFileItem = (props) => (layout === 'grid' ? renderItemGrid(props) : renderItemList(props));

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderBreadcrumbs()}
      <FlatList
        data={driveData}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={layout === 'grid' ? 2 : 1}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const getItemIcon = (item) => {
  if (item.type === 'folder') return 'folder';
  const extension = item.name.split('.').pop().toLowerCase();
  const iconMap = {
    jpg: 'image', png: 'image', pdf: 'picture-as-pdf',
    doc: 'article', xls: 'table-chart', zip: 'archive'
  };
  return iconMap[extension] || 'insert-drive-file';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  breadcrumbContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFFFFF' },
  backButton: { marginRight: 10 },
  breadcrumbText: { fontSize: 16, flex: 1 },
  layoutToggle: { padding: 5 },
  listContainer: { padding: 10 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 5, backgroundColor: '#FFF', borderRadius: 5 },
  listIcon: { marginRight: 10 },
  listDetails: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: 'bold' },
  fileMetadata: { fontSize: 12, color: '#666' },
  listMoreIcon: { marginLeft: 10 },
  gridItem: { flex: 1, alignItems: 'center', margin: 5, padding: 10, backgroundColor: '#FFF', borderRadius: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default DriveFileBrowser;





%%%%%%%%%%%%%%%





import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, SafeAreaView ,Dimensions} from 'react-native';
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
import ModalForUploadAndCreateFile from '../../Modaals/ModalForUpladAndCreateFile';
import ActionModal from '../../Modaals/ActionModal';
import ProgressBar from '../../components/ProgressBar';
import strings from '../../helper/Language/LocalizedStrings';
import WorkspaceModal from '../../Modaals/WorkspaceModal';
import getItemIcon from '../../constants/GetItemIcon';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MyDrive = () => {
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector(state => state.workspace.workspace);
  const language = useSelector((state) => state.language.language);
  const navigation=useNavigation()
  const [folderStack, setFolderStack] = useState([{ id: null, name: 'Root' }]);
  const [allData, setAllData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionModal,setactionModal]=useState(false)
  const [workspacemodal,setshowworkspacemodal]=useState(false)

  const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };

  const FilderData = [
    { id: 1, Image: folderIcon, title: strings.Folder, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiZm9sZGVyIiwiaXNJbmFjdGl2ZSI6ZmFsc2UsIm9wZXJhdG9yIjoiPSIsInZhbHVlS2V5IjoiMTEifV0%3D' },
    { id: 2, Image: fileIcon, title: strings.File, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidGV4dCIsImlzSW5hY3RpdmUiOmZhbHNlLCJvcGVyYXRvciI6Ij0iLCJ2YWx1ZUtleSI6IjAyIn1d' },
    { id: 3, Image: imageIcon, title: strings.Image, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoiaW1hZ2UiLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNSJ9XQ%3D%3D' },
    { id: 4, Image: video, title:strings.Video, filters: 'W3sia2V5IjoidHlwZSIsInZhbHVlIjoidmlkZW8iLCJpc0luYWN0aXZlIjpmYWxzZSwib3BlcmF0b3IiOiI9IiwidmFsdWVLZXkiOiIwNCJ9XQ%3D%3D' },
  ];





  const currentFolderId = folderStack[folderStack.length - 1].id;

  const fetchData = useCallback(async (filter = null) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId: search?search:0,
          filters: filter,
          folderId: currentFolderId, 
          page: 1,
          workspaceId: workspaces?workspaces:0,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          orderBy: 'updated_at',
          orderDir: 'desc',
        },
      });
      setAllData(response.data.data);
      if(response.status===403){
        navigation.replace('Login')
      }
    } catch (error) {
      console.log('Got Error', error);
      if (error.response && error.response.status === 403) {
        navigation.replace('Login') // Redirect to login page
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFolderId, workspaces, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleFilterSelection = (filter) => {
    setCurrentFilter(filter); // Update the current filter
    fetchData(filter); // Fetch data based on the selected filter
  };
  
  useEffect(() => {
    fetchData();
  }, [fetchData, currentFolderId, user]);

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

  const handleItemPress = useCallback((item) => {
    if (item.type === 'folder') {
      setFolderStack(prev => [...prev, { id: item.id, name: item.name }]);
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

  const handleBackPress = useCallback(() => {
    if (folderStack.length > 1) {
      setFolderStack(prev => prev.slice(0, -1));
    }
  }, [folderStack]);

 
  const renderItemList = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
 
      <View style={styles.iconContainer}>
        <Icon name={getItemIcon(item)} size={24} color={COLORS.white} />
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
  );

  const renderItemGrid = ({ item }) => (
    
    <TouchableOpacity style={styles.grid} onPress={() => handleItemPress(item)}>
      <View>

    
      <View style={styles.iconContainer}>
        <Icon name={getItemIcon(item)} size={24} color={COLORS.white} />
      </View>
      <Text style={styles.itemText}>{item.name.length > 13 ? `${item.name.substring(0, 13)}...` : item.name}</Text>
      <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </View>
      <TouchableOpacity
           onPress={() => toggleModalVisible(item)}
          >
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  );

  const toggleModalVisible = (item) => {
    setSelectedItem(item); 
    setactionModal(!actionModal);
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>

   
    <View style={styles.container}>
        <CustomHeader
         
          right={true}
          grid={true}
          title={strings.MyFiles}
          ViewType={isGrid}  // Pass the view type state
          hadleGidList={handleGridListToggle}
        />
       
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
</View>

      {folderStack.length > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
          <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.currentFolderText}>{strings.CurrentFolder}: {folderStack[folderStack.length - 1].name}</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={organizedData}
          renderItem={isGrid ?    renderItemList:renderItemGrid}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<View style={{flex:1,alignItems:'center'}}>
          <Text style={styles.emptyText}>This folder is empty|| or API Problem From BackEnd Token Expired</Text>
        </View>}
            numColumns={isGrid ? 1 : 2}// Number of columns for grid or list view
          onRefresh={onRefresh}
          refreshing={refreshing}
          key={isGrid ?  'list':'grid'} // Key to re-render FlatList on viewType change
        />
        
       
      )}
      <TouchableOpacity style={styles.btn} 
      onPress={()=>setshowworkspacemodal(true)}
      >
            {/* <Text style={styles.text}>+</Text> */}
            <Image source={require('../../assets/arrangement.png')} tintColor={COLORS.white}/>
          </TouchableOpacity>
          <WorkspaceModal
          visible={workspacemodal}
          user={user}
          // folderId={currentFolderId} 
          onClose={() => setshowworkspacemodal(false)}/>
      <ActionModal 
            isVisible={actionModal} 
            onClose={()=>setactionModal(false)}
            user={user}
            item={selectedItem}/>
    </View>
    </SafeAreaView>
  );
};

export default MyDrive;

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
});

