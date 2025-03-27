import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, Platform, ScrollView, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkspaceAsync } from '../redux/reducers/workspaceSlice';
import { COLORS } from '../utils/Colors';
import { makeApiCall } from '../helper/apiHelper';
import DropdownComp from '../components/DropdownComp';
import Icon from 'react-native-vector-icons/FontAwesome';
import { memberDropdownData, ownerDropdownData } from '../constants/DroDownData';
import InputBox from '../components/InputBox';
import WorkspacemembersModal from './WorkspacemembersModal';
import axios from 'axios';
import { baseURL } from '../utils/constant/settings';

const WorkspaceModal = ({ visible, onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspace.workspace);
  const [workspaceList, setWorkspaceList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editWorkspaceName, setEditWorkspaceName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const dispatch = useDispatch();

  // Function to start editing a workspace
  const handleStartEdit = (workspace) => {
    setEditingWorkspaceId(workspace.id);
    setEditWorkspaceName(workspace.name);
    setIsEditing(true);
  };

  // Function to fetch user workspaces
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/me/workspaces`, {
        headers: { Authorization: `Bearer ${user?.access_token}`, },
        params:{workspaceId:0}
      });
  
      console.log('Full Axios Response:', response.data);
  
      if (response.data && response.data.status === 'success' && response.data.workspaces) {
        setWorkspaceList(response.data.workspaces);
      } else {
        console.error('Unexpected API Response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
// console.log(workspaceList,'Work-------->>>>>>')
  const toggleCreateWorkspace = () => {
    setShowNameInput(!showNameInput);
    setNewWorkspaceName('');
  };

  const createWorkSpace = async () => {
    if (!newWorkspaceName.trim()) {
      Alert.alert("Error", "Please enter a workspace name");
      return;
    }
    
    try {
      setIsCreating(true);
      const response = await makeApiCall('/api/v1/workspace', user?.access_token, 'post', {
        name: newWorkspaceName,
      });
  
      if (response?.status === 'success' && response?.workspace) {
        console.log('Workspace created successfully!', response.workspace);
        
        // Add the new workspace to the existing list for immediate display
        const newWorkspace = response.workspace;
        
        // Update workspaceList state with the new workspace
        setWorkspaceList(prevList => [...prevList, newWorkspace]);
        
        // Reset the input field and hide it
        setNewWorkspaceName('');
        setShowNameInput(false);
        
        // Select the newly created workspace but DON'T close modal yet
        dispatch(updateWorkspaceAsync(newWorkspace.id));
        
        Alert.alert(
          "Success", 
          `Workspace "${newWorkspace.name}" created successfully`
        );
      } else {
        console.error('Failed to create workspace:', response);
        Alert.alert("Error", "Failed to create workspace. Please try again.");
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
      Alert.alert("Error", "An error occurred while creating the workspace");
    } finally {
      setIsCreating(false);
    }
  };

  // Fetch workspaces whenever modal becomes visible
  useEffect(() => { 
    if (visible) {
      fetchWorkspaces();
      setShowNameInput(false);
      setIsEditing(false); // Reset editing state when modal opens
    }
  }, [visible]);

  const handleDropdownOptionSelect = (workspaceId, optionValue, item) => {
    console.log(`Selected option ${optionValue} for workspace ${workspaceId}`);
    
    switch (optionValue) {
      case "1": // Members
      console.log("View members");
      // setIsModalVisible(true);
      setSelectedWorkspaceId(workspaceId);
      // onClose()
        // onClose();
        break;
      case "2": // Rename or Leave
        const isOwner = item.owner_id === user?.id;
        if (isOwner) {
          // Start editing mode
          handleStartEdit(item);
        } else {
          // Leave workspace
          console.log("Leave workspace");
        }
        break;
      case "3": // Delete (owner only)
      Alert.alert(
        "Delete Workspace",
        `Are you sure you want to delete the workspace "${item.name}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => handleDeleteWorkspace(workspaceId),
          },
        ]
      );
        // handleDeleteWorkspace(workspaceId);
        break;
      case "4": // Share (owner only)
        console.log("Share workspace");
        break;
      default:
        break;
    }
  };
  
  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      setIsLoading(true);
      const response = await makeApiCall(`/api/v1/workspace/${workspaceId}`, user?.access_token, 'delete');   
      if (response?.status === 'success') {
        console.log('Workspace deleted successfully!', response);
        // Remove the deleted workspace from the list
        setWorkspaceList(prevList => prevList.filter(item => item.id !== workspaceId));
        Alert.alert("Success", "Workspace deleted successfully");
      } else {
        console.error('Failed to delete workspace:', response);
        Alert.alert("Error", "Failed to delete workspace. Please try again.");
      }
    } catch (error) {   
      console.error('Error deleting workspace:', error);
      Alert.alert("Error", "An error occurred while deleting the workspace");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to submit workspace edit
  const submitWorkspaceEdit = async () => {
    if (!editWorkspaceName.trim()) {
      Alert.alert("Error", "Please enter a workspace name");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await makeApiCall(`/api/v1/workspace/${editingWorkspaceId}`, user?.access_token, 'put', {
        name: editWorkspaceName,
      });
      
      if (response?.status === 'success') { 
        console.log('Workspace updated successfully!', response);
        
        // Update the workspace in the list
        setWorkspaceList(prevList => prevList.map(item => {
          if (item.id === editingWorkspaceId) {
            return {
              ...item,
              name: editWorkspaceName,
            };
          }
          return item;
        }));
        
        // Reset editing state
        setIsEditing(false);
        setEditingWorkspaceId(null);
        
        Alert.alert("Success", "Workspace updated successfully");
      } else {    
        console.error('Failed to update workspace:', response);
        Alert.alert("Error", "Failed to update workspace. Please try again.");
      }
    } catch (error) {
      console.error('Error updating workspace:', error);
      Alert.alert("Error", "An error occurred while updating the workspace");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingWorkspaceId(null);
    setEditWorkspaceName('');
  };

  // Add a key to force re-render of the scroll view when workspace list changes
  const listKey = `workspace-list-${workspaceList.length}-${Date.now()}`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.outsideModal} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {isEditing ? (
            <>
              <View style={styles.createWorkspaceForm}>
                <TextInput
                  style={styles.workspaceNameInput}
                  placeholder="Enter workspace name"
                  placeholderTextColor={COLORS.black}
                  value={editWorkspaceName}
                  onChangeText={(val) => setEditWorkspaceName(val)}
                  autoFocus
                />
              </View>
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={cancelEditing}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.createButton]}
                  onPress={submitWorkspaceEdit}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Updating...' : 'Update'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {isLoading && !isCreating && (
                <View style={styles.loadingContainer}>
                  <Text>Loading workspaces...</Text>
                </View>
              )}
              
              {showNameInput ? (
                <View style={styles.createWorkspaceForm}>
                  <TextInput
                    style={styles.workspaceNameInput}
                    placeholderTextColor={COLORS.black}
                    placeholder="Enter workspace name"
                    value={newWorkspaceName}
                    onChangeText={(val) => setNewWorkspaceName(val)}
                    autoFocus
                  />
                  <View style={styles.formButtons}>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={toggleCreateWorkspace}
                      disabled={isCreating}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.createButton]}
                      onPress={createWorkSpace}
                      disabled={isCreating}
                    >
                      <Text style={styles.buttonText}>
                        {isCreating ? 'Creating...' : 'Create'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.createWORKSPACE}
                  onPress={toggleCreateWorkspace}
                  disabled={isLoading || isCreating}
                >
                  <Icon name='plus' size={20} color={COLORS.white} />
                  <Text style={{...styles.text, color: COLORS.white}}>
                    Create new workspace
                  </Text>
                </TouchableOpacity>
              )}
              
              {/* Private Option */}
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  dispatch(updateWorkspaceAsync(0));
                  onClose();
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
              <ScrollView 
                style={styles.workspaceList}
                key={listKey} // Force re-render when list changes
              >
                {workspaceList.map((item) => (
                  <View 
                    style={{flexDirection:'row', justifyContent:'space-between'}} 
                    key={item.id}
                  >
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        dispatch(updateWorkspaceAsync(item.id));
                        onClose();
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
                    <View style={{width:'40%'}}> 
                      <DropdownComp 
                        workspaceId={item.id}
                        isOwner={item.owner_id === user.id} 
                        onPress={(optionValue) => handleDropdownOptionSelect(item.id, optionValue, item)} 
                      />
                      
                    </View>
                  </View>
                ))}
              {isModalVisible && (
                <WorkspacemembersModal
                  visible={isModalVisible}
                  onClose={() => setIsModalVisible(false)}
                  workspaceId={selectedWorkspaceId}
                />
              )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
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
  outsideModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: '5%',
    maxHeight: '60%'
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
  createWORKSPACE:{
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: COLORS.blue,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  workspaceList: {
    maxHeight: '80%',
  },
  createWorkspaceForm: {
    marginBottom: 20,
  },
  workspaceNameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    color:COLORS.black
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: COLORS.blue,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  }
});