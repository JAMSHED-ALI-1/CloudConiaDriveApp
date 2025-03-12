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
import ProgressBar from '../../constants/Userinfo';
import ActionModal from '../../Modaals/ActionModal';
import strings from '../../helper/Language/LocalizedStrings';
import getItemIcon from '../../constants/GetItemIcon';
import { accessData } from '../../utils/UserAccessData';
import SubscriptionAnimation from '../../constants/SubscriptionAnimation';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Stared = () => {
  const user = useSelector((state) => state.auth.user);
  const [hasAccess, setHasAccess] = useState(false);
  const workspaces = useSelector(state => state.workspace.workspace);
  const language = useSelector((state) => state.language.language);
  const navigation=useNavigation()
  const [folderStack, setFolderStack] = useState([{ id: null, name: strings.STARED_FILES }]);
  const [allData, setAllData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGrid, setIsGrid] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionModal,setactionModal]=useState(false)
  const handleGridListToggle = () => {
    setIsGrid(!isGrid);
  };

  useEffect(() => {
    const hasAccess = accessData(user);
    setHasAccess(hasAccess);
    console.log('User has access:', hasAccess);
  }, [user]);
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





  const currentFolderId = folderStack[folderStack.length - 1].id;

  const fetchData = useCallback(async (filter = null) => {
    try {
      setIsLoading(true);
    //     const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}${pageId}&folderId=${folderId}&workspaceId==${workspaces}&orderBy=updated_at&orderDir=desc&page=1&sharedOnly=true`, {
      const response = await axios.get(`${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`, {
        headers: { Authorization: `Bearer ${user?.access_token}` },
        params: {
          pageId: search?search:' starred',
          filters: filter,
          folderId: currentFolderId, // Use the current folder ID to fetch folder contents
          page: 1,
          workspaceId: workspaces,
          deletedOnly: false,
          starredOnly: true,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          orderBy: 'updated_at',
          orderDir: 'desc',
        },
      });
      setAllData(response.data.data);
    //   console.log(response.data.data)
    } catch (error) {
      console.log('Got Error', error);
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


  const handleItemPress = useCallback(async (item) => {
    if (item.type === 'folder') {
      try {
        // Add new folder to the stack
        setFolderStack((prev) => [
          ...prev,
          {
            id: item.id,
            name: item.name,
            hash: item.hash,
          },
        ]);
  
        // Fetch the contents of the new folder
        const response = await axios.get(`${baseURL}/drive/file-entries`, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
          params: {
            pageId: item.hash, // Use the item's hash
            folderId: item.hash, // Folder ID as the item's hash
            workspaceId: 0, // You specified workspaceId as 0
            orderBy: 'updated_at',
            orderDir: 'desc',
            page: 1,
          },
        });
  
        // Handle the successful response
        const data = response.data.data;
        // console.log('Fetched folder contents:', data);
        setAllData(data); // Update state with the new folder data
  
      } catch (error) {
        console.error('Error fetching folder contents:', error);
      }
    } else if (item.type === 'image') {
      // Navigate to the ImageViewer if the item is an image
      navigation.navigate('ImageViewer', {
        filePath: item,
        user: user,
      });
    }
  }, [navigation, user,folderStack]);

  const handleBackPress = useCallback(async () => {
    if (folderStack.length > 1) {
      try {
        // Get the previous folder's information
        const previousFolder = folderStack[folderStack.length - 2];
        
        // Remove the current folder from the stack
        setFolderStack(prev => prev.slice(0, -1));

        // Fetch the contents of the previous folder
        const response = await axios.get(`${baseURL}/drive/file-entries`, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
          params: {
            pageId: search || 0,
            filters: currentFilter,
            folderId: previousFolder.id, // Use the previous folder's ID
            page: 1,
            workspaceId: workspaces?workspaces:0,
            deletedOnly: false,
            starredOnly: false,
            recentOnly: false,
            sharedOnly: true,
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
        console.error('Error fetching previous folder contents:', error);
       
      }
    }
  }, [folderStack, user, currentFilter, workspaces, search]);





  const renderItemList = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
 
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
            <Image source={require('../../assets/MoreOption.png')} style={[{ height: 20, width: 20,tintColor:COLORS.black}]} />
          </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderItemGrid = ({ item }) => (
    
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
            <Image source={require('../../assets/MoreOption.png')} style={[styles.moreicon, { height: 20, width: 20,tintColor:COLORS.black }]} />
          </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>

   
    <View style={styles.container}>
        <CustomHeader
          
          right={true}
          grid={true}
          title={strings.STARED_FILES}
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
          </View> */}
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

<View style={{ borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View>
      {folderStack.length > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
          <Text style={styles.backButtonText}>{strings.Backto} {folderStack[folderStack.length - 2].name}</Text>
        </TouchableOpacity>
      )}
      {
        folderStack.length<=1 &&(
          <Text style={styles.currentFolderText}>{strings.STARED_FILES}</Text>
        )
      }

      </View>
      {/* <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>setshowdropdown(true)}>
        <Text style={styles.currentFolderText}>Sort</Text>
        <Image source={require('../../assets/icon/sorting.png')} style={{height:25,width:25,resizeMode:'contain'}}/>
      </TouchableOpacity> */}
      </View>
      {/* {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.blue} />
      ) : (
        <FlatList
        data={organizedData}
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
            data={organizedData}
            renderItem={isGrid ? renderItemList:renderItemGrid}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={styles.emptyText}>This folder is empty</Text>
              </View>
            }
            numColumns={isGrid ? 1 : 2}
            onRefresh={onRefresh}
            refreshing={refreshing}
            key={isGrid ?  'list':'grid'} 
          />
        ) : (
          <>
            <Text>Please Subscribe</Text>
            <SubscriptionAnimation />
          </>
        )}
     
      <ActionModal 
            isVisible={actionModal} 
            onClose={()=>setactionModal(false)}
            user={user}
            item={selectedItem}/>
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
      icon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white, // Apply a tint color if applicable
      },
});




export default Stared

