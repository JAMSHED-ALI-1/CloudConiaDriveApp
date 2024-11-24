import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

const FileSystemComponent = ({ user, baseURL, initialWorkspaceId }) => {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);

  

  const fetchFolderFiles = useCallback(async (folderId = null, query = '') => {
    if (!user?.access_token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${baseURL}/drive/file-entries`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
        params: JSON.stringify({
          pageId: query ? 'search' : 'folder',
          folderId: query ? null : (folderId === 0 ? null : folderId),
          page,
          query,
          workspaceId: query ? 0 : workspaceId,
          deletedOnly: false,
          starredOnly: false,
          recentOnly: false,
          sharedOnly: false,
          per_page: 100,
          orderBy: query ? 'updated_at' : undefined,
          orderDir: query ? 'desc' : undefined,
        }),
      });

      const data = await response.json();
      setCurrentFolder(data?.folder || null);
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching folder files:', error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to fetch folder contents.',
        button: 'close',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, baseURL, page, workspaceId]);

  useEffect(() => {
    if (user?.access_token) {
      fetchFolderFiles();
    }
  }, [fetchFolderFiles, user]);

  const handleItemPress = (item) => {
    if (item.type === 'folder') {
      setFolderStack(prevStack => [
        ...prevStack,
        { id: currentFolder?.id, name: currentFolder?.name || 'Root' },
      ]);
      setPage(1); // Reset page when entering a new folder
      fetchFolderFiles(item.id);
    } else {
      // Handle file selection based on file type
      console.log('File selected:', item.name);
    }
  };

  const handleBackPress = () => {
    if (folderStack.length > 0) {
      const previousFolder = folderStack.pop();
      setFolderStack([...folderStack]);
      setPage(1); // Reset page when going back
      fetchFolderFiles(previousFolder.id);
    } else {
      Dialog.show({
        type: ALERT_TYPE.INFO,
        title: 'Info',
        textBody: 'You are at the root folder.',
        button: 'close',
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset page when searching
    fetchFolderFiles(null, query);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    fetchFolderFiles(currentFolder?.id, searchQuery);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
    >
      <Icon 
        name={item.type === 'folder' ? 'folder' : 'insert-drive-file'} 
        size={24} 
        color="#FF6600" 
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{new Date(item.updated_at).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => console.log('Options for:', item.name)}>
        <Icon name="more-vert" size={24} color="#000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recently Edited</Text>
        <View style={styles.headerIcons}>
          <Icon name="list" size={24} color="#000" />
          <Icon name="grid-view" size={24} color="#000" />
        </View>
      </View>
      <View style={styles.searchBar}>
        <Icon name="search" size={24} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.currentPath}>{currentFolder?.name || 'All Files'}</Text>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isLoading}
        onRefresh={() => {
          setPage(1);
          fetchFolderFiles(currentFolder?.id, searchQuery);
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add new item')}>
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 16,
  },
  currentPath: {
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F3FF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default FileSystemComponent;