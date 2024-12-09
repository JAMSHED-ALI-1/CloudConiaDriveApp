import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Image,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';

const API_BASE_URL = 'https://drive.coniacloud.com/api/v1';

const PERMISSION_OPTIONS = [
  { label: 'View Only', value: ['view'] },
  { label: 'Edit & Download', value: ['edit', 'download'] },
  { label: 'Full Access', value: ['edit', 'download', 'share'] }
];

const ShareFileModal = ({ isVisible, onClose, item, user }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(PERMISSION_OPTIONS[0]);
  const [accessUsers, setAccessUsers] = useState([]);

  useEffect(() => {
    if (isVisible) {
      fetchSharedUserInfo();
    }
  }, [isVisible]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleAddEmail = () => {
    const trimmedEmail = currentEmail.trim();
    
    if (!trimmedEmail) {
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emailList.includes(trimmedEmail)) {
      setError('This email has already been added');
      return;
    }

    setEmailList([...emailList, trimmedEmail]);
    setCurrentEmail('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailList(emailList.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' || nativeEvent.key === ',') {
      handleAddEmail();
    }
  };

  const getApiHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const fetchSharedUserInfo = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/drive/file-entries/${item.id}/model`,
        { headers: getApiHeaders(user?.access_token) }
      );
      // console.log('userinfo---',response)
      setAccessUsers(response.data.fileEntry.users|| []);
      // console.log('userinfo',response)
      return response.data;
    } catch (error) {
      console.error('Error fetching shared user info:', error);
      Alert.alert('Error', 'Failed to fetch shared users');
      throw error;
    }
  };

  const handlePermissionChange = async (userId, newPermissions) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE_URL}/file-entries/${item.id}/share/${userId}`,
        { permissions: newPermissions },
        { headers: getApiHeaders(user?.access_token) }
      );
      await fetchSharedUserInfo();
      Alert.alert('Success', 'Permissions updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  const shareFileWithUsers = async () => {
    if (emailList.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/file-entries/${item.id}/share`,
        { 
          emails: emailList, 
          permissions: selectedPermission.value 
        },
        { headers: getApiHeaders(user?.access_token) }
      );

    // console.log('shere',response.data)
      await fetchSharedUserInfo();
      
      // Show success message and reset form
      Alert.alert(
        'Success',
        `File shared successfully with ${emailList.length} recipient${emailList.length > 1 ? 's' : ''}!`,
        [{
          text: 'OK',
          onPress: () => {
            setEmailList([]);
            setCurrentEmail('');
            setSelectedPermission(PERMISSION_OPTIONS[0]);
          }
        }]
      );
    } catch (error) {
      let errorMessage = 'Failed to share the file. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You don\'t have permission to share this file.';
            break;
          case 404:
            errorMessage = 'File not found.';
            break;
          case 422:
            errorMessage = 'One or more email addresses are invalid.';
            break;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionLabel = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No Access';
    if (permissions.includes('share')) return 'Full Access';
    if (permissions.includes('edit')) return 'Edit & Download';
    return 'View Only';
  };

  const renderEmailChips = () => (
    <ScrollView 
      horizontal={false} 
      style={styles.chipsContainer}
      contentContainerStyle={styles.chipsContentContainer}
    >
      {emailList.map((email, index) => (
        <View key={index} style={styles.chip}>
          <Text style={styles.chipText}>{email}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveEmail(email)}
            style={styles.chipRemove}
          >
            <Text style={styles.chipRemoveText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const renderAccessControl = () => (
    <View style={styles.accessControlContainer}>
      {/* Owner Section */}
      {/* <View style={styles.accessControl}>
        <View style={styles.accessControlRow}>
          <View style={styles.accessControlImg}>
            {user?.avatar && (
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatarImage}
              />
            )}
          </View>
          <View>
            <Text style={styles.userName}>{user?.display_name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>
        <Text style={styles.ownerText}>Owner</Text>
      </View> */}

      {/* Shared Users Section */}
      {accessUsers.map((accessUser, index) => (
        <View key={index} style={styles.accessControl}>
          <View style={styles.accessControlRow}>
            <View style={styles.accessControlImg}>
              {accessUser?.avatar && (
                <Image 
                  source={{ uri: accessUser.avatar }} 
                  style={styles.avatarImage}
                />
              )}
            </View>
            <View>
              <Text style={styles.userName}>{accessUser?.display_name || 'User'}</Text>
              <Text style={styles.userEmail}>{accessUser?.email || ''}</Text>
            </View>
          </View>
          <TouchableOpacity
  onPress={() => {
    if (!accessUser.owns_entry) { // Check if the user does not own the entry
      Alert.alert(
        'Change Permission',
        `Change permission for ${accessUser.email}`,
        [
          ...PERMISSION_OPTIONS.map(option => ({
            text: option.label,
            onPress: () => handlePermissionChange(accessUser.id, option.value)
          })),
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  }}
  disabled={accessUser.userowns_entry} // Disable press for the owner
>
  <Text style={styles.permissionText}>
    {accessUser.owns_entry===true ? 'Owner' : getPermissionLabel(accessUser.permissions)}
  </Text>
</TouchableOpacity>

        </View>
      ))}
    </View>
  );

  return (
   

    
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
    >
       <SafeAreaView style={{flex:1}}>
      <ScrollView>
        <View style={styles.modalContent}>
          <View style={{flexDirection:'row',justifyContent:'space-between',}}>
          <Text style={styles.title}>Share {(item?.name || 'File').length>20?(item?.name||'File').slice(0,18)+'....':(item?.name || 'File')}</Text>
          <TouchableOpacity onPress={onClose}>

          
         <Image source={require('../assets/icons/close.png')} style={{height:40,width:40,resizeMode:'contain',bottom:5}}/>
         </TouchableOpacity>
          </View>
         
          
          <View style={styles.emailInputContainer}>
            {emailList.length > 0 && renderEmailChips()}
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Enter email addresses (separate with comma or Enter)"
              value={currentEmail}
              onChangeText={(text) => {
                setCurrentEmail(text);
                setError('');
                // Handle comma-separated input
                if (text.endsWith(',')) {
                  const email = text.slice(0, -1).trim();
                  if (email) {
                    setCurrentEmail('');
                    if (validateEmail(email) && !emailList.includes(email)) {
                      setEmailList([...emailList, email]);
                    } else {
                      setError('Please enter a valid email address');
                    }
                  }
                }
              }}
              onSubmitEditing={handleAddEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onKeyPress={handleKeyPress}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Permission Level</Text>
            <TouchableOpacity 
              style={styles.dropdown}
              onPress={() => {
                Alert.alert(
                  'Select Permission',
                  '',
                  [...PERMISSION_OPTIONS.map(option => ({
                    text: option.label,
                    onPress: () => setSelectedPermission(option)
                  })),
                  { text: 'Cancel', style: 'cancel' }]
                );
              }}
            >
              <Text>{selectedPermission.label}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.accessSection}>
            <Text style={styles.sectionTitle}>Who has access</Text>
            {renderAccessControl()}
          </View>

          <TouchableOpacity 
            style={[
              styles.button, 
              (loading || emailList.length === 0) && styles.buttonDisabled
            ]} 
            onPress={shareFileWithUsers}
            disabled={loading || emailList.length === 0}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Share with {emailList.length} recipient{emailList.length !== 1 ? 's' : ''}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
    </Modal>
   
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    borderRadius: 12,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '100%',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emailInputContainer: {
    marginBottom: 12,
  },
  chipsContainer: {
    maxHeight: 100,
    marginBottom: 8,
  },
  chipsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#1976d2',
    marginRight: 4,
  },
  chipRemove: {
    marginLeft: 4,
    padding: 2,
  },
  chipRemoveText: {
    color: '#1976d2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 70,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  accessSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  accessControlContainer: {
    marginTop: 8,
  },
  accessControl: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accessControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accessControlImg: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  ownerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  permissionText: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#007aff80',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 12,
    fontSize: 14,
  },
});

export default ShareFileModal;