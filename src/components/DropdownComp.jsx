import { StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { COLORS } from '../utils/Colors';
import { Dropdown } from 'react-native-element-dropdown';
import strings from '../helper/Language/LocalizedStrings';

const DropdownComp = ({ onPress, isOwner }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  // 🧠 Recompute dropdown options when language changes
  const dropdownData = useMemo(() => {
    return isOwner
      ? [
          { label: strings.RENAME, value: "2" },
          { label: strings.DELETEFILE, value: "3" },
        ]
      : [
          { label: strings.LEAVE, value: "2" },
        ];
  }, [isOwner, strings.RENAME, strings.DELETEFILE, strings.LEAVE]);

  const handleOptionSelect = (item) => {
    setValue(item.value); // We only track the value, not the label
    setIsFocus(false);

    if (onPress) {
      onPress(item.value);
    }
  };

  useEffect(() => {
    // Optionally reset value on language change
    // setValue(null);
  }, [strings]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: COLORS.blue }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={dropdownData}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? strings.MANAGE : '...'}
        itemTextStyle={{ color: COLORS.black, fontWeight: '600' }}
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
    fontWeight: '500'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.red,
    fontWeight: '500'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
