import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import getItemIcon from '../constants/GetItemIcon';
import { COLORS } from '../utils/Colors';

const FileItem = ({ item, grid, handleMediaPreview,onOpenModal }) => {
  const getIconName = (type) => {
    switch (type) {
      case 'folder': return 'folder';
      case 'pdf': return 'document-text';
      case 'image': return 'image';
      case 'video': return 'videocam';
      default: return 'document';
    }
  };

  return (
    
    <TouchableOpacity
      onPress={() => handleMediaPreview(item)}
      style={[styles.card, grid && styles.gridCard]}
    >
      <View style={styles.iconContainer}>
        {/* <Icon 
          name={getIconName(item.type)} 
          size={40} 
          color={item.type === 'folder' ? "#FF8C00" : "#007BFF"} 
        /> */}
         <Image 
        source={getItemIcon(item)} 
        style={styles.icon} 
        resizeMode="contain" 
      />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemModified}>
          {moment(item.updated_at).fromNow()}
        </Text>
        {item.file_size > 0 && (
          <Text style={styles.itemSize}>
            {(item.file_size / 1024).toFixed(2)} KB
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => onOpenModal(item)} style={[styles.moreOptions,grid && styles.gridMoreOptions]}>
        <Image source={require('../assets/MoreOption.png')} style={styles.moreIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  gridCard: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemModified: {
    fontSize: 12,
    color: '#777',
  },
  itemSize: {
    fontSize: 10,
    color: '#777',
  },
  icon: {
    width: 35,
    height: 35,
  margin:10
    // tintColor: COLORS.white, // Apply a tint color if applicable
  },
  moreOptions: {
    // position: 'absolute',
    // right: 10,
    // top: 10,
  },
  gridMoreOptions: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  moreIcon: {
    height: 20,
    width: 20,
  },
});

export default FileItem;
