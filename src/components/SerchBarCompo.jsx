import { StyleSheet, View, TextInput } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import strings from '../helper/Language/LocalizedStrings';
import { COLORS } from '../utils/Colors';

const SearchBarCompo = ({ search, setSearchQuery }) => {
  return (
    
      <InputBox 
        placeholder={strings.SEARCH}
        icon={require('../assets/Search.png')}
        
        // style={{...styles.container}}
        value={search}
        // style={{backgroundColor:'red'}}
        onChangeText={(text) => setSearchQuery(text)}// Debounced function
        onSubmitEditing={(event) => setSearchQuery(event.nativeEvent.text)} // Instant update on Enter
      />
  
  );
};

export default SearchBarCompo;

const styles = StyleSheet.create({
  container:{
    backgroundColor:COLORS.red,
    color:'red'
  }
});
