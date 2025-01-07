import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkspaceAsync } from '../redux/reducers/workspaceSlice';

const WorkspaceModal = ({ visible, onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspace.workspace);
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
       
        <View style={styles.modalContainer}>
          {/* Private Option */}
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              onClose();
              dispatch(updateWorkspaceAsync(0));
            }}
          >
            <Image
              source={require('../assets/insurance.png')}
              style={styles.modalIcon}
            />
            <Text style={workspaces === 0 ? styles.select : styles.text}>
              Private
            </Text>
          </TouchableOpacity>

          {/* User Workspaces */}
          {user?.workspace?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.modalItem}
              onPress={() => {
                onClose();
                dispatch(updateWorkspaceAsync(item.id));
              }}
            >
              <Image
                source={require('../assets/arrangement.png')}
                style={styles.modalIcon}
              />
              <Text style={item.id === workspaces ? styles.select : styles.text}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default WorkspaceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalContainer: {
   
    backgroundColor: '#fff',
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom:Platform.OS==='android'?50:0
  // height:'40%'
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
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  select: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
