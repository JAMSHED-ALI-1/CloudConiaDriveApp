import { Modal, View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { makeApiCall } from '../helper/apiHelper';
import { COLORS } from '../utils/Colors';
import { useSelector } from 'react-redux';
import strings from '../helper/Language/LocalizedStrings';
import SuccessAndFailModal from './SuccessAndFailModal';

const Trashremove = ({ visible, onClose, user, item, onSuccess }) => {
  const language = useSelector((state) => state.language.language);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [showLottie, setShowLottie] = useState(false);
  const [lottieUrl, setLottieUrl] = useState(require('../assets/data/post.json'));

  const restoreFile = async () => {
    let data = {
      entryIds: [item?.id],
    };
    const response = await makeApiCall('/api/v1/file-entries/restore', user?.access_token, 'post', data);
    console.log('restore response', response);
    if (response.status === 'success') {
      setLottieUrl(require('../assets/data/post.json'));
      setShowLottie(true);
      onClose();
      onSuccess();
    }
  };

  const permanentDelete = async () => {
    try {
      let data = {
        entryIds: [item?.id],
        deleteForever: true,
      };
      const response = await makeApiCall('/api/v1/file-entries/delete', user?.access_token, 'post', data);
      if (response?.status === 'success') {
        Alert.alert('Success', 'File permanently deleted!');
        setLottieUrl(require('../assets/data/post.json'));
        setShowLottie(true);
        onSuccess();
        onClose();
      } else {
        Alert.alert('Error', 'Failed to delete file permanently.');
      }
    } catch (error) {
      console.error('Error permanently deleting file:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
      setLottieUrl(require('../assets/data/post.json'));
      setShowLottie(true);
    }
  };

  const confirmPermanentDelete = () => {
    Alert.alert(
      "Confirm Permanent Delete",
      "This action cannot be undone. Do you want to permanently delete this file?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Permanent delete cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: permanentDelete,
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Do you really want to delete this file?",
      [
        {
          text: "No",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            console.log("Proceeding with delete");
            await restoreFile();
            Alert.alert('Successfully removed Item');
            onClose();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); confirmDelete(); }}>
              <Image source={require('../assets/FileFolderIcons/delete.png')} style={styles.modalIcon} tintColor={COLORS.blue} />
              <Text style={styles.nornalText}>{strings.Recovery}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); confirmPermanentDelete(); }}>
              <Image source={require('../assets/FileFolderIcons/permadelete.png')} style={styles.modalIcon} tintColor={COLORS.blue} />
              <Text style={styles.nornalText}>{strings.Permanently_Delete}</Text>
            </TouchableOpacity>
            {showLottie && (
              <SuccessAndFailModal
                visible={showLottie}
                onClose={() => setShowLottie(false)}
                url={lottieUrl}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Trashremove;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalContainer: {
    height: '30%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalIcon: {
    width: 30,
    height: 30,
    marginRight: 20,
    resizeMode: 'contain',
  },
  nornalText: {
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.black,
  },
});