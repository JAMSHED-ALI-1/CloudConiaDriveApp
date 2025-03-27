import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { makeApiCall } from '../helper/apiHelper';
import { COLORS } from '../utils/Colors';
import { useSelector } from 'react-redux';
import strings from '../helper/Language/LocalizedStrings';
import SuccessAndFailModal from './SuccessAndFailModal';
import showMessageHandler from '../utils/constant/ShowMessageHandler';

const RenameModal = ({ isVisible, onClose, item, user, onSuccess }) => {
  const workspaces = useSelector(state => state.workspace.workspace);
  const [initialName, setInitialName] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [lottieUrl, setLottieUrl] = useState(require('../assets/data/Successfully.json'));

  useEffect(() => {
    if (isVisible && item) {
      setName(item.name);
      setInitialName(item.name);
    }
  }, [isVisible, item]);

  const renameFile = async () => {
    if (name.trim() === "") {
      setError('Please enter a file name');
      return;
    }
    if (name === initialName) {
      onClose();
      return;
    }
    setError('');
    setLoading(true);
    setShowLottie(true);
    setLottieUrl(require('../assets/data/Successfully.json'));

    try {
      const response = await makeApiCall(`/api/v1/file-entries/${item.id}?workspaceId=${workspaces}&_method=PUT`, user?.access_token, 'post', {
        name: name
      });

      setLoading(false);
      onClose();
      onSuccess();
      if (response.status === 'success') {
        setLottieUrl(require('../assets/data/Successfully.json'));
        showMessageHandler('success', 'File is successfully renamed!');
      }
      else {
        throw new Error('Failed to rename file.');
      }
    } catch (error) {
      console.error('Error renaming file:', error.message);
      setLoading(false);
      setLottieUrl(require('../assets/data/failed.json'));
      showMessageHandler('error', 'Failed to rename the file. Please try again.');
    }
    finally {
      setLoading(false);    
      setTimeout(() => {
        setShowLottie(false);
        onClose();        
      },700);
    }
  }; 


  return (
    <Modal isVisible={isVisible} onBackdropPress={() => {
      setName(initialName); // Reset name to initial on close
      setError(''); // Clear error on close
      onClose();
    }}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{strings.RENAME} file</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new file name"
          placeholderTextColor={COLORS.noermalText}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError('');
          }}
          autoFocus={true}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            setName(initialName); // Reset name on cancel
            setError(''); // Clear error on cancel
            onClose();
          }}>
            <Text style={styles.cancelButtonText}>{strings.Cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.renameButton} onPress={renameFile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{strings.RENAME}</Text>}
          </TouchableOpacity>
        </View>
      </View>
      {showLottie && (
        <SuccessAndFailModal
          visible={showLottie}
          onClose={() => setShowLottie(false)}
          url={lottieUrl}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    color: COLORS.noermalText
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 8,
    borderRadius: 4,
    color: COLORS.noermalText
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  renameButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RenameModal;