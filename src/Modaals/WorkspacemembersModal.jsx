import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { makeApiCall } from '../helper/apiHelper';
import { useSelector } from 'react-redux';
import axios from 'axios';

const WorkspacemembersModal = ({visible,onClose,workspaceId}) => {
     const user = useSelector((state) => state.auth.user);
 const workspaces = useSelector(state => state.workspace.workspace);
// console.log(workspaces,'workspace------>>>>>>000')
    const fetchWorkspace = async (workspaceId, token) => {
      try {
        const response = await axios.get(
          `https://drive.coniacloud.com/api/v1/workspace/${workspaceId}`, 
          {
            headers: { Authorization: `Bearer ${token}` },
            // params: { workspaceId } // Query parameter
          }
        );
        // console.log('Workspace Data:', response.data);
      } catch (error) {
        console.error('Error fetching workspace:', error.response?.data || error);
      }
    };
    
    // Example Usage
  
      useEffect(() => { 
        fetchWorkspace(workspaceId, user?.access_token);
      }
      , []);

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        
    >
        <TouchableOpacity onPress={onClose} style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'white',width:'80%',height:'50%',borderRadius:10,padding:10}}>
            <Text style={{...styles.textHeading}}>Manage workspace members</Text>
            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>

            <Icon name="user" size={30} color="black" style={{}} onPress={onClose}/>
            <Text style={{...styles.normalText}}>Workspace Members</Text>
            </View>
            </View>
        </TouchableOpacity>
    </Modal>

  )
}

export default WorkspacemembersModal

const styles = StyleSheet.create({
    textHeading:{  
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10
    },
    normalText:{
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    }
})