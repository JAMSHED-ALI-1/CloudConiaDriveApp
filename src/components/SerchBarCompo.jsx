import { StyleSheet, View, TextInput } from 'react-native';
import React from 'react';
import InputBox from './InputBox';
import strings from '../helper/Language/LocalizedStrings';

const SearchBarCompo = ({ search, setSearchQuery }) => {
  return (
    <View >
      <InputBox 
        placeholder={strings.SEARCH}
        icon={require('../assets/Search.png')}
        value={search}
        // style={{backgroundColor:'red'}}
        onChangeText={(text) => setSearchQuery(text)}// Debounced function
        onSubmitEditing={(event) => setSearchQuery(event.nativeEvent.text)} // Instant update on Enter
      />
    </View>
  );
};

export default SearchBarCompo;

const styles = StyleSheet.create({});
