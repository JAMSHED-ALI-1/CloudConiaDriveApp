import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import FileSystemComponent from './src/components/FileSystemComponent';

const Test = () => {
  const [grid, setGrid] = useState(false); // Manage grid state

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Buttons for toggling between List and Grid */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setGrid(false)} // Set to List
      >
        <Text>List</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setGrid(true)} // Set to Grid
      >
        <Text>Grid</Text>
      </TouchableOpacity>

      {/* Pass grid state to FileSystemComponent */}
      <FileSystemComponent isGrid={grid} />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: '90%',
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
});
