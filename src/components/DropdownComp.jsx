import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { COLORS } from '../utils/Colors';
import { Dropdown } from 'react-native-element-dropdown';

const ownerDropdownData = [
  // { label: "Members", value: "1" },
  { label: "Rename", value: "2" },
  { label: "Delete", value: "3" },
 
];

const memberDropdownData = [
  // { label: "Members", value: "1" },
  { label: "Leave", value: "2" },
];

const DropdownComp = ({ onPress, isOwner }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  const handleOptionSelect = (item) => {
    setValue(item.value);
    console.log(item.value,'value');
    setIsFocus(false);

    if (onPress) {
      onPress(item.value);
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: COLORS.blue }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={isOwner ? ownerDropdownData : memberDropdownData} // Show data based on ownership
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Manage' : '...'}
        itemTextStyle={{ color: COLORS.black,fontWeight:'600' }}
        value={value}
        dropdownPosition={'top'}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleOptionSelect}
      />
    </View>
  );
};

export default DropdownComp;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dropdown: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight:'500'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.red,
     fontWeight:'500'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
