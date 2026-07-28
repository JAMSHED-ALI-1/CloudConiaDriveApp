




import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import strings from '../../helper/Language/LocalizedStrings';

// Auto-detect device language
const getDefaultLanguage = () => {

  const locales = RNLocalize.getLocales();
  const timezone = RNLocalize.getTimeZone(); // e.g., "Asia/Kolkata"

  // If countryCode is missing, infer from timezone
  const countryCode = locales[0]?.countryCode || inferCountryFromTimezone(timezone);

  // console.log('⏰ Timezone:', timezone);
  // console.log('🔄 Inferred Country Code:', countryCode);

  if (Array.isArray(locales) && locales.length > 0) {
    const { languageCode, countryCode } = locales[0];

    // console.log('📱 Language Code:', languageCode); 
    // console.log('🌍 Country Code:', countryCode);  

    switch (timezone) {
      case 'Asia/Kolkata':
        return 'eng';
      case 'Asia/Istanbul'||'Europe/Istanbul':
        return 'ger';
      case 'Europe/Berlin'||'Europe/Frankfurt':
        return 'tur';
      default:
        return 'eng';
    }
  } else {
    console.log('⚠️ No locale found, falling back to default.');
  }

  return 'eng'; 
};
const inferCountryFromTimezone = (tz) => {
  if (tz.includes('Asia/Kolkata')) return 'IN';
  if (
    tz.includes('Europe/Istanbul') || // Main Turkish TZ
    tz.includes('Asia/Istanbul')      // Legacy/alternative label
  ) return 'TR';
  
  if (
    tz.includes('Europe/Berlin') ||   // Main German TZ
    tz.includes('Europe/Busingen')    // TZ for Büsingen am Hochrhein (follows CH rules but is German)
  ) return 'DE';
  
  return 'US'; // Fallback
};


// Initial state
const initialState = {
  language: 'eng', // Default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      console.log('🔤 Setting language:', action.payload);
      state.language = action.payload;
      strings.setLanguage(action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;

// Thunk to load from AsyncStorage or fallback to auto
export const loadLanguageFromStorage = () => async (dispatch) => {
  try {
    const savedLang = await AsyncStorage.getItem('language');
    const langToUse = savedLang || getDefaultLanguage();

    if (!savedLang) {
      await AsyncStorage.setItem('language', langToUse);
    }

    dispatch(setLanguage(langToUse));
  } catch (err) {
    console.error('❌ Language loading failed:', err);
    dispatch(setLanguage(getDefaultLanguage()));
  }
};

export default languageSlice.reducer;
