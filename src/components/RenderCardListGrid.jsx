import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import moment from 'moment';
import getItemIcon from '../constants/GetItemIcon';
import FastImage from 'react-native-fast-image';

const FileItem =React.memo(({ item, grid, handleMediaPreview, onOpenModal, user, workspace }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(item.extension?.toLowerCase()) || item.type?.toLowerCase().includes('image');

  return (
    <TouchableOpacity onPress={() => handleMediaPreview(item)} style={[styles.card, grid && styles.gridCard]}>
      <View style={styles.iconContainer}>
        {/* Show loading indicator if the image is still loading */}

        {/* Show image if valid, otherwise fallback to icon */}
        {isImage && isLoading && !hasError && <ActivityIndicator size="small" color="#007bff" style={styles.loader} />}
        {isImage && !hasError ? (
          <FastImage
            style={styles.imageThumbnail}
            source={{
              uri: `https://drive.coniacloud.com/api/v1/file-entries/${item?.id}?workspaceId=${workspace}&thumbnail=true`,
              headers: { Authorization: `Bearer ${user?.access_token}` },
              priority: FastImage.priority.high,
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode={FastImage.resizeMode.contain}
            // resizeMode='contain'
          />
        ) : (
          <Image source={getItemIcon(item)} style={styles.icon} resizeMode="contain" />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemModified}>{moment(item.updated_at).fromNow()}</Text>
        {item.file_size > 0 && (
          <Text style={styles.itemSize}>
            {(item.file_size / 1024).toFixed(2)} KB
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => onOpenModal(item)} style={[styles.moreOptions, grid && styles.gridMoreOptions]}>
        <Image source={require('../assets/MoreOption.png')} style={styles.moreIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

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
    justifyContent: 'center',
    alignItems: 'center',
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
    margin: 10,
  },
  imageThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  moreOptions: {},
  gridMoreOptions: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  moreIcon: {
    height: 20,
    width: 20,
  },
  loader: {
    position: 'absolute',
  },
});

export default FileItem;
