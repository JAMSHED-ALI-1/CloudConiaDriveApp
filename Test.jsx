import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View ,Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from './src/utils/Colors'
import { makeApiCall } from './src/helper/apiHelper'
import axios, { Axios } from 'axios'
import { baseURL } from './src/utils/constant/settings'
import strings from './src/helper/Language/LocalizedStrings'
import { Dropdown } from 'react-native-element-dropdown'
import CustomButton from './src/components/CustomButton'
import showMessageHandler from './src/utils/constant/ShowMessageHandler'
const PERMISSION_OPTIONS = [
  { label: 'View Only', value: 'view' },
  { label: 'Edit & Download', value: 'edit_download' },
  { label: 'Full Access', value: 'full_access' },
];





const Test = ({isVisible, onClose, item, user,workspace ,onSuccess}) => {
 
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [value,setValue] = useState('')
  const [accessUsers, setAccessUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(1);
    const [currentEmail, setCurrentEmail] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [error, setError] = useState('');
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleaccessUserPermissions = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://drive.coniacloud.com/api/v1/file-entries/${item.id}/share?workspaceId=${workspace}?timestamp=${new Date().getTime()}`,
        {
          emails: emailList,
          permissions: mapPermissionToObject(value)

        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
  
      const updatedUsers = res.data.users;
      setAccessUsers(updatedUsers);
  
      // Set default permissions right away
      const defaultPermissions = {};
      updatedUsers.forEach((user) => {
        defaultPermissions[user.id] = getPermissionLabel(user.entry_permissions);
      });
      setSelectedPermissions(defaultPermissions);
  
      showMessageHandler('Permissions updated successfully', 'success');
  
      setEmailList([]);
      setCurrentEmail('');
      setValue('');
      onSuccess();
    } catch (error) {
      console.log('Error updating permissions:', error?.response?.data || error);
      showMessageHandler(
        error?.response?.data?.message || 'Error updating permissions',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
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

  const getPermissionLabel = (entry_permissions) => {
    if (!entry_permissions || Object.keys(entry_permissions).length === 0) return 'No Access';
  
    const { view, edit, download } = entry_permissions;
  
    if (view && edit && download) return 'Full Access';
    if (view && (edit || download)) return 'Edit & Download';
    if (view) return 'View Only';
  
    return 'No Access';
  };
  

  
const handleAccessUser = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/drive/file-entries/${item.id}/model?workspaceId=${workspace}`,
      {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      }
    );

    if (res.data?.fileEntry?.users) {
      const users = res.data.fileEntry.users;
      setAccessUsers(users);
      console.log('✅ Setting users:', users);
      // ✅ Set initial permission values
      const defaultPermissions = {};
      users.forEach((user) => {
        defaultPermissions[user.id] = getPermissionLabel(user.entry_permissions);
      });
      setSelectedPermissions(defaultPermissions);
      onSuccess();
    } else {
      setAccessUsers([]);
    }
  } catch (error) {
    console.log('Error fetching access users:', error);
  }
};

const handleApi = async () => {
  await handleaccessUserPermissions();
  // await handleTrash();
};


const mapPermissionToObject = (permissionValue) => {
  switch (permissionValue) {
    case 'view':
      return { view: true };
    case 'edit_download':
      return { view: true, edit: true, download: true };
    case 'full_access':
      return { view: true, edit: true, download: true }; // assuming same as edit_download here
    default:
      return {};
  }
};



const handleTrash=async () => {
  try {
    const res=await axios.post('https://drive.coniacloud.com/api/v1/file-entries/trash',{
      emails: emailList,
      permissions: [value]
    },{
      headers:{
        Authorization:`Bearer ${user?.access_token}`
      }
    })
  }catch (error) {
    console.log('Error fetching access users:', error);
    
  }
}
useEffect(() => {
  if (isVisible) {
    console.log('🔁 Modal opened, refreshing access user list...');
    setTimeout(() => {
      handleAccessUser();
    }, 500);
  }
}, [isVisible]);







  
  return (
    <Modal
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onShow={() => {
        console.log('📥 Modal Shown → Fetching users...');
        handleAccessUser(); // <--- Calls every time modal is displayed
      }}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
      <View activeOpacity={1} style={styles.whitespace}>
    <Text style={styles.title}>Enter Mail</Text>
    {emailList.map((email, index) => (
  <View key={index} style={[styles.userRow, { justifyContent: 'space-between' }]}>
    <Text style={styles.userName}>{email}</Text>
    <TouchableOpacity onPress={() => {
      const newList = emailList.filter((_, i) => i !== index);
      setEmailList(newList);
      if (newList.length === 0) setError('');
    }}>
      <Text style={{ color: 'red', fontWeight: 'bold' }}>✕</Text>
    </TouchableOpacity>
  </View>
))}


    <View style={styles.container}>
      <TextInput
      placeholder='Enter Mail'
      // value={value}
      
      style={{
        borderWidth:1,
        borderColor:'black',
        padding:10,
        borderRadius:10,
        width:'100%',
        marginVertical:10
      }}
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
      }}/>
      <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.dropdownText}
      selectedTextStyle={styles.dropdownText}
      data={PERMISSION_OPTIONS}
      labelField="label"
      valueField="value"
      placeholder="Select Permission"
      value={value}
      onChange={item => {
        setValue(item.value); // This sets value to: 'view', 'edit_download', or 'full_access'
      }}
      // renderItem={(item) => (
      //   <Text style={styles.dropdownText}>{item.label}</Text>
      // )}
      // renderSelectedItem={(item) => (
      //   <Text style={styles.dropdownText}>{item.label}</Text>
      // )}
      />
      {error ? (
  <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
) : null}
      <View style={{width:'40%',paddingVertical:15}}> 

      <CustomButton buttonTitle={'Add Email'} onPress={handleAddEmail}/>
      </View>
    <Text
    style={{...styles.title}}>who has aceess</Text>
   {accessUsers?.map((user, index) => (
  <View key={index} style={styles.userRow}>
    <View style={styles.userInfo}>
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri: user?.avatar.includes('www.gravatar.com')
              ? user.avatar
              : `https://drive.coniacloud.com/${user?.avatar}`,
          }}
          style={styles.avatar}
          resizeMethod="contain"
        />
      </View>
      <Text style={styles.userName}>{user.display_name}</Text>
    </View>

    {user.owns_entry ? (
      <Text style={styles.ownerText}>Owner</Text>
    ) : (
   <>


<Text style={styles.permissionText}>
  {getPermissionLabel(user.entry_permissions)}
</Text>

        </>
    )}
  </View>
))}

   
    </View>
    {emailList.length>0 &&<CustomButton buttonTitle={'Submit'} onPress={handleApi}/>}
    </View>
    
    </TouchableOpacity>
    </Modal>
  )
}

export default Test

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  whitespace: {
    height: '90%',
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: COLORS.black,
    fontWeight: 'bold',
  },
 
  container:{

    // flex:1,
    // padding:15
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatarWrapper: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.blue,
  },
  
  userName: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  
  ownerText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  
  permissionWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  
  permissionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  dropdown: {
    width: 160,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
   
  },
  
  dropdownText: {
    fontSize: 14,
    color: COLORS.black,
  },
  
  dropdownContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
    // borderColor: COLORS.black,
    // borderWidth: 1,
  },
  

})