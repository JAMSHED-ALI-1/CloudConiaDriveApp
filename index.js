/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { name as appName } from './app.json';
import store, { persistor } from './src/redux/store';
import Test from './Test';

const Root = () => (
  
  <Provider store={store}>
    
      <App />
      {/* <Test/> */}
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);