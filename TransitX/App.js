import { Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Maps from './Screens/Map.jsx';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={Maps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




function HomeScreen({ navigation }) {
  return (
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate('Details')}
    />
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
