import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/reducers/themechange';

const ThemeHandler = ({ children }) => {
  const deviceTheme = useColorScheme(); // 'light' | 'dark'
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);

  useEffect(() => {
    if (mode === 'system') {
      dispatch(setTheme(deviceTheme || 'light'));
    }
  }, [deviceTheme, mode]);

  return children;
};

export default ThemeHandler;
