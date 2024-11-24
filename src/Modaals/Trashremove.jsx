import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/Colors';
import { makeApiCall } from '../helper/apiHelper';
const Trashremove = ({visible, onClose,user, item }) => {
    const restoreFile=async()=>{
        let data = {
            entryIds: [item?.id],
          }
        const responce=await makeApiCall('/api/v1/file-entries/restore', user?.access_token, 'post', data);
        console.log('restore responce',responce)
        if(responce.status==='success'){
            onClose()
        }
    }
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
            <TouchableOpacity style={styles.modalItem} 
            onPress={restoreFile}>
              <Image source={require('../assets/icons/Revert.jpg')} style={styles.modalIcon} />
              <Text>Recovery</Text>
            </TouchableOpacity>
            
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

export default Trashremove

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'flex-end', // Align modal content to the bottom
        width: '100%',
      },
      modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    
    
})