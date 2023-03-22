import { Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Maps from './Screens/Map.jsx';
import Home from './Screens/Home.jsx';
import SignUp from './Screens/SignUp.jsx';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Maps" component={Maps} />
        {/* <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Maps} /> */}
        {/* <Stack.Screen name="Sign Up" component={SignUp} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
