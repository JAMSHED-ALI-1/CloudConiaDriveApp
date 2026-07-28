// src/modals/ChangeThemeModal.js
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import strings from '../helper/Language/LocalizedStrings';
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import {setTheme} from '../redux/reducers/themechange';

// import { setTheme } from '../redux/reducers/themeSlice';

const Themes = [
  {label: strings.DARK, value: 'dark', icon: 'moon'},
  {label: strings.LIGHT, value: 'light', icon: 'sun'},
  {label: strings.DEFAULT, value: 'default', icon: 'monitor'},
];

const ChangeThemeModal = ({isvisible, onclose}) => {
  const currentTheme = useSelector(state => state.theme.theme);
  const dispatch = useDispatch();
  const [selectedtheme, setSelectedtheme] = useState(currentTheme);

  useEffect(() => {
    if (isvisible) {
      setSelectedtheme(currentTheme);
    }
  }, [isvisible, currentTheme]);

  const handleApply = () => {
    dispatch(setTheme(selectedtheme));
    showMessageHandler('Theme changed successfully!');
    onclose();
  };

  return (
    <Modal
      onRequestClose={onclose}
      animationType="slide"
      transparent={true}
      visible={isvisible}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={onclose}
        activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={styles.whitespace}>
          <Text style={styles.title}>{strings.SELECTTHEME}</Text>

          {Themes.map(theme => (
            <TouchableOpacity
              key={theme.value}
              style={styles.langItem}
              onPress={() => setSelectedtheme(theme.value)}>
              <View style={{flexDirection: 'row', alignItems: 'center',gap:10}}>
                <Icon
                  name={theme.icon}
                  size={22}
                  color={
                    selectedtheme === theme.value
                      ? COLORS.black
                      : COLORS.black
                  }
                />
                <Text style={styles.langText}>{theme.label}</Text>
              </View>
              {selectedtheme === theme.value && (
                <Icon name="check" size={30} color={COLORS.black} />
              )}
            </TouchableOpacity>
          ))}

          <CustomButton buttonTitle={strings.Apply} onPress={handleApply} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  whitespace: {
    height: '40%',
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
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  langText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '600',
  },
});

export default ChangeThemeModal;
