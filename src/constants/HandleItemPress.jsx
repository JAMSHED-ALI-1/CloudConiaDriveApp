import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const HandleItemPress = ({ folderStack, handleBackPress, setShowDropdown, COLORS, strings }) => {
  return (
    <View style={styles.container}>
      {/* Back Button Section */}
      {folderStack.length > 1 ? (
        <TouchableOpacity style={styles.backButton} 
        // onPress={handleBackPress}
        >
          {/* <Image source={require('../assets/icon/arrow-back.png')} style={styles.icon} /> */}
          <Text style={styles.backButtonText}>
            {strings.Backto} {folderStack[folderStack.length - 2].name}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.currentFolderText}>{strings.HOME}</Text>
      )}

      {/* Sort Dropdown Section */}
      <TouchableOpacity 
        style={styles.sortButton} 
        // onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.currentFolderText}>{strings.SORT}</Text>
        {/* <Image 
          source={require('../assets/icon/sorting.png')} 
          style={styles.sortIcon} 
        /> */}
      </TouchableOpacity>
    </View>
  );
};

export default HandleItemPress;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  currentFolderText: {
    fontSize: 16,
    color: '#666',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});
