import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import HistoryScreen from './src/pages/HistoryScreen';
import DetailHistory from './src/pages/DetailHistory';
const AppStack = createStackNavigator({
  History: {
    screen: HistoryScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Detail: {
    screen: DetailHistory,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
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
