import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/pages/Home';
import Contribute from './components/pages/Contribute'
import ContributeSecondPage from './components/pages/ContributeSecondPage';
import ContributeMapAndAutocomplete from './components/widgets/contribution/ContributeMapAndAutocomplete';
import ContributeFinalPage from './components/pages/ContributeFinalPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Contribute" component={Contribute}/>
          <Stack.Screen name="ContributeSecondPage" component={ContributeSecondPage} options={{gestureEnabled: false}}/>
          <Stack.Screen name="ContributeMapAndAutocomplete" component={ContributeMapAndAutocomplete}/>
          <Stack.Screen name="ContributeFinalPage" component={ContributeFinalPage} options={{gestureEnabled: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}