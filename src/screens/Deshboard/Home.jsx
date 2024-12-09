import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { COLORS } from '../../utils/Colors';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL, fileColorCode } from '../../utils/constant/settings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { timeAgo } from '../../helper/functionHelper';
import ModalForUploadAndCreateFile from '../../Modaals/ModalForUpladAndCreateFile';
import { FastField } from 'formik';
import HomeHeader from '../../components/HomeHeader';
import AnimationModal from '../../Modaals/AnimationModal';
import ActionModal from '../../Modaals/ActionModal';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../../components/ProgressBar';
import strings from '../../helper/Language/LocalizedStrings';
import { makeApiCall } from '../../helper/apiHelper';
import getItemIcon from '../../constants/GetItemIcon';
import ShortingModal from '../../Modaals/ShortingModal';

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const language = useSelector((state) => state.language.language);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [folderStack, setFolderStack] = useState([{ id: null, name: 'Root' }]);
  const [allData, setAllData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState('list'); 
  const [showmodal,setShowmodal]=useState(false)
  const [showModalAi,setshowmodalAi]=useState(false)
  const [actionModal,setactionModal]=useState(false)
  const currentFolderId = folderStack[folderStack.length - 1].id;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDrodown,setshowdropdown]=useState(false)
  const [sortingInfo, setSortingInfo] = useState({
    sortBy: 'updated_at',
    sortDir: 'desc',        
  });
  
  const navigation=useNavigation()

  const sortByOptions = [
    { key: 'Size', value: 'file_size' },
    { key: 'Name', value: 'name' },
    { key: 'Last modified', value: 'updated_at' },
    { key: 'Upload date', value: 'created_at' },
  ];
  // console.log('---',workspaces)
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId: 0,
          folderId: currentFolderId, // Use the current folder ID to fetch folder contents
          page: 1,
          workspaceId: workspaces?workspaces:0,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          orderBy: sortingInfo.sortBy,
          orderDir: sortingInfo.sortDir,
        },
      });
      setAllData(response.data.data);
      console.log(response.status)
      // if(response.status===403){
      //   navigation.replace('Login')
      // }
    } catch (error) {
      console.log('Got Error', error);
      // if (error.response && error.response.status === 403) {
      //   navigation.replace('Login') // Redirect to login page
      // }
    } finally {
      setIsLoading(false);
    }
  }, [user, currentFolderId,workspaces]);
  const handleSortApply = ({ sortBy, sortDir }) => {
    setSortingInfo({ sortBy, sortDir }); // Update the state
    fetchData( sortBy, sortDir); // Fetch data with new sort options
    console.log('Sort applied:', sortBy, sortDir);
  };

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

  // const handleItemPress = useCallback((item) => {
  //   if (item.type === 'folder') {
  //     setFolderStack(prev => [...prev, { id: item.id, name: item.name }]);
  //   } else {
  //     console.log('File clicked:', item);
  //     // Handle file click (e.g., open file, show details, etc.)
  //   }
  // }, []);
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


  const toggleModalVisible = (item) => {
    setSelectedItem(item); 
    setactionModal(!actionModal);
  };
  



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
            <Image source={require('../../assets/MoreOption.png')} style={[ { height: 20,width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderItemGrid = ({ item }) => (
    
    <TouchableOpacity style={styles.grid} onPress={() => handleItemPress(item)}>
      <View>

    
      <View style={styles.iconContainer}>
        <Icon name={getItemIcon(item)} size={24} color={COLORS.white} />
      </View>
      <Text style={styles.itemText}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}</Text>
      <Text style={styles.filetxtnormal}>{timeAgo(item.created_at)}</Text>
      </View>
      <TouchableOpacity
           onPress={() => toggleModalVisible(item)}
          >
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 30, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>

  
    <View style={styles.container}>
      <HomeHeader user={user} handleIconPress={() => setshowmodalAi(true)} />
       

      <ProgressBar/>
      <View style={styles.statusContainer}>
          {/* <StorageStatus user={user} usertoken={user?.access_token} /> */}
          {/* <ProgressBar/> */}
        </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingVertical:8 }}>
        <Text style={styles.heading}>{strings.RECENTLY_EDITED}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => setViewType('list')}>
            <Image source={require('../../assets/list.png')} style={[styles.rightImage, { tintColor: viewType === 'list' ? '#004181' : '#B3B4B6' }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewType('grid')}>
            <Image source={require('../../assets/Grid.png')} style={[styles.rightImage, { tintColor: viewType === 'grid' ? '#004181' : '#B3B4B6' }]} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View>
      {folderStack.length > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
          <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.currentFolderText}>{folderStack[folderStack.length - 1].name}</Text>
      </View>
      <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>setshowdropdown(true)}>
        <Text style={styles.currentFolderText}>Sort</Text>
        <Image source={require('../../assets/icon/sorting.png')} style={{height:25,width:25,resizeMode:'contain'}}/>
      </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={organizedData}
          renderItem={viewType === 'grid' ? renderItemGrid : renderItemList}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<View style={{flex:1,alignItems:'center'}}>
            <Text style={styles.emptyText}>This folder is empty</Text>
          </View>}
          numColumns={viewType === 'grid' ? 2 : 1} // Number of columns for grid or list view
          onRefresh={onRefresh}
          refreshing={refreshing}
          key={viewType === 'grid' ? 'grid' : 'list'} // Key to re-render FlatList on viewType change
        />
      )}
       <TouchableOpacity style={styles.btn} 
      onPress={()=>setShowmodal(true)}
      >
            <Text style={styles.text}>+</Text>
          </TouchableOpacity>
          <ModalForUploadAndCreateFile
          visible={showmodal}
          user={user}
          folderId={currentFolderId} 
          onClose={() => setShowmodal(false)}/>
           <AnimationModal visible={showModalAi} onClose={() => setshowmodalAi(false)} />
            <ActionModal 
            isVisible={actionModal} 
            onClose={()=>setactionModal(false)}
            user={user}
            item={selectedItem}/>
             <ShortingModal
            isVisible={showDrodown} 
            onClose={()=>setshowdropdown(false)}
            onApply={handleSortApply}
            sortingOptions={sortByOptions}
            initialSorting={sortingInfo}
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
    paddingHorizontal:15,
  
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color:COLORS.boldText
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
    color:COLORS.black
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
    width: 20,
    height: 20,
  },
  moreicon: {
    height: 25,
    width: 10,
    resizeMode: 'contain',
    position:'absolute',
    right:0
    
    
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
    alignItems: "center",
  },
  emptyText:{
padding:10,
textAlign:'center',
marginTop:30


  }
});
