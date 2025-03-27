import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import strings from '../helper/Language/LocalizedStrings'
import { COLORS } from '../utils/Colors'
import Icon from 'react-native-vector-icons/Ionicons';

const Gridlist = ({setShowDropdown,toggleView,grid,showshort}) => {
  return (
    <View style={styles.toggleContainer}>
           { showshort ?<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} 
            onPress={setShowDropdown}
            >
              <Text style={styles.currentFolderText}>{strings.SORT}</Text>
              <Image source={require('./../assets/icon/sorting.png')} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
            </TouchableOpacity>:null}
            <TouchableOpacity
              style={[styles.toggleButton, !grid && styles.toggleButtonActive]}
              onPress={toggleView}
            >
              <Icon name="list" size={20} color={!grid ? '#fff' : '#007BFF'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, grid && styles.toggleButtonActive]}
              onPress={toggleView}
            >
              <Icon name="grid" size={20} color={grid ? '#fff' : '#007BFF'} />
            </TouchableOpacity>
          </View>
  )
}

export default Gridlist

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginBottom: 10,
      },
      toggleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#007BFF',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginLeft: 8,
      },
      toggleButtonActive: {
        backgroundColor: '#007BFF',
      },
      buttoncontainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.blue,
        borderRadius: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
      },
})