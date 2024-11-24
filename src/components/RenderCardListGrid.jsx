import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { timeAgo } from '../helper/functionHelper';
const deviceWidth = Dimensions.get('window').width;

// Dummy Icons (replace with actual imports)
import folderIcon from '../assets/icon/folder.png';
import fileIcon from '../assets/icon/file.png';
import pdfIcon from '../assets/icons/pdf.png';
import playIcon from '../assets/icons/play.png';
import videoIcon from '../assets/icon/video.png';
import wordIcon from '../assets/icon/file.png';
import imageIcon from '../assets/icon/image.png';
// import ModalComponent from './ModalComponent';

// import { fileColorCode } from '../constant/settings';

const RenderCardListGrid = ({
  fileEntries,
  onPress,
  refreshing,
  onRefresh,
  user,
  token,
  setRefresh,
  refresh,
  isLoading,
  isGrid,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleShareModal, setVisibleShareModal] = useState(false);

  const toggleModalVisible = item => {
    setSelectedItem(item);
    setVisibleShareModal(!visibleShareModal);
  };

  const toggleHideModal = () => {
    setVisibleShareModal(!visibleShareModal);
  };

  const renderFileTypeIcon = item => {
    const fileTypeMap = {
      folder: folderIcon,
      pdf: pdfIcon,
      word: wordIcon,
      image: imageIcon,
      video: videoIcon,
      audio: playIcon,
      default: fileIcon,
    };

    const extensionToType = {
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      svg: 'image',
      pdf: 'pdf',
      doc: 'word',
      docx: 'word',
      mp4: 'video',
      avi: 'video',
      mkv: 'video',
      mov: 'video',
      wmv: 'video',
      mp3: 'audio',
      wav: 'audio',
    };

    const fileTypeKey = item.type === 'folder' ? 'folder' : extensionToType[item.extension] || 'default';

    return fileTypeMap[fileTypeKey] || fileTypeMap.default;
  };

  const renderFileCard = ({ item, index }, isGrid) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item)}
        style={[
          styles.fileCard,
          {
            width: isGrid ? "47%" : '97%',
            height: isGrid ? 120 : 95,
          },
        ]}
      >
        <View style={styles.fileCardHeader}>
          <Image source={renderFileTypeIcon(item)} style={styles.itemIcon} />
          <TouchableOpacity onPress={() => toggleModalVisible(item)}>
            <Image
              source={require('../assets/MoreOption.png')}
              style={[
                styles.moreIcon,
                {
                  // tintColor: fileColorCode[Math.floor(Math.random() * fileColorCode.length)],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.fileCardInfo}>
          <Text style={styles.fileName}>
            {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name}
          </Text>
          <Text style={styles.fileDetails}>{timeAgo(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {fileEntries.length === 0 ? (
        <Text style={styles.noDataText}>No files available.</Text>
      ) : (
        <FlatList
          data={fileEntries}
          renderItem={item => renderFileCard(item, isGrid)}
          numColumns={isGrid ? 2 : 1}
          keyExtractor={item => item.id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          // onRefresh={() => {
          //   setRefresh(true); // Set the refresh state to true
          //   onRefresh(); // Trigger the parent refresh function
          // }}
          key={isGrid ? 'grid' : 'list'}
        />
      )}
{/* 
      {selectedItem && (
        <ModalComponent
          isVisible={visibleShareModal}
          setModalVisible={setVisibleShareModal}
          onClose={toggleHideModal}
          user={user}
          PreviewToken={token}
          item={selectedItem}
          setRefresh={setRefresh}
          refresh={refresh}
          loading={refresh}
        />
      )} */}
    </View>
  );
};

export default RenderCardListGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fileCard: {
    margin: 8,
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#CFECFF',
    justifyContent: 'space-between',
  },
  fileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemIcon: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  moreIcon: {
    height: 20,
    width: 15,
    resizeMode: 'contain',
  },
  fileCardInfo: {
    marginTop: 5,
    alignItems: 'flex-start',
  },
  fileName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  fileDetails: {
    fontSize: 12,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '800',
  },
});
