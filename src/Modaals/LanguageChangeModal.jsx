

import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';

  import Icon from 'react-native-vector-icons/Feather';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useDispatch } from 'react-redux';
import { COLORS } from '../utils/Colors';
import CustomButton from '../components/CustomButton';
import strings from '../helper/Language/LocalizedStrings';
import showMessageHandler from '../utils/constant/ShowMessageHandler';
import { setLanguage } from '../redux/reducers/languageSlice';
  
  const languages = [
    { label: 'English', value: 'eng' },
      { label: 'Türkçe', value: 'tur' },
      { label: 'Deutsch', value: 'ger' },
  ];
  
  const LanguageChangeModal = ({ isvisible, onclose }) => {
    const dispatch = useDispatch();
    const [selectedLang, setSelectedLang] = useState('eng');
  
    useEffect(() => {
      // Load saved language when modal opens
      const getSavedLang = async () => {
        const savedLang = await AsyncStorage.getItem('language');
        if (savedLang) setSelectedLang(savedLang);
      };
      if (isvisible) getSavedLang();
    }, [isvisible]);
  
    const handleApply = async () => {
      try {
        await AsyncStorage.setItem('language', selectedLang);
        dispatch(setLanguage(selectedLang));
        showMessageHandler('Language updated successfully!');
         onclose(); // Close modal after applying
      } catch (err) {
        console.error('Error setting language:', err);
      }
    };
  
    return (
      <Modal
        onRequestClose={onclose}
        animationType="slide"
        transparent={true}
        visible={isvisible}
      >
        <TouchableOpacity style={styles.overlay} onPress={onclose} activeOpacity={1}>
          <TouchableOpacity activeOpacity={1} style={styles.whitespace}>
            <Text style={styles.title}>Select Language</Text>
  
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.value}
                style={styles.langItem}
                onPress={() => setSelectedLang(lang.value)}
              >
                <Text style={styles.langText}>{lang.label}</Text>
                {selectedLang === lang.value && (
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
      width: '100%',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
       marginBottom:10,
    },
    langText: {
      fontSize: 18,
      color: COLORS.black,
      fontWeight: '600',
    },
  })
  
export default LanguageChangeModal

