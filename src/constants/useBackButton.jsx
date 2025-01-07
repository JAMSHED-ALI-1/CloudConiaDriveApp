import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackButton = (navigation, handler) => {
  useEffect(() => {
    // Focus event: add the back button listener
    const focusListener = navigation.addListener('focus', () => {
      BackHandler.addEventListener('hardwareBackPress', handler);
    });

    // Blur event: remove the back button listener
    const blurListener = navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    });

    // Cleanup the listeners when the component is unmounted or handler changes
    return () => {
      focusListener();
      blurListener();
      BackHandler.removeEventListener('hardwareBackPress', handler); // Ensures cleanup
    };
  }, [navigation, handler]); // Re-run the effect if either navigation or handler changes
};
