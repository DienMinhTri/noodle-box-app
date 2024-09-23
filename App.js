import React from 'react';
import Home from './src/screens/Home'
import Update from './src/screens/Update'
import Authorization from './src/components/Authorization'
import EmailVerificationScreen from './src/components/EmailVerification';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Authorization" component={Authorization} options={{ headerShown: false }}/>
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Update" component={Update} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
