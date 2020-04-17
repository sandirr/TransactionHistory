import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import HistoryScreen from './src/pages/HistoryScreen';
const AppStack = createStackNavigator({
  History: {
    screen: HistoryScreen,
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      // Loading: Loading,
    },
    {
      initialRouteName: 'App',
    },
  ),
);

function App() {
  console.disableYellowBox = true;
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

export default App;
