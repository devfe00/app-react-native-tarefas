import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdicionarTarefaScreen from './screens/AdicionarTarefaScreen';
import ListaTarefasScreen from './screens/ListaTarefasScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaTarefas">
        <Stack.Screen name="AdicionarTarefa" component={AdicionarTarefaScreen} />
        <Stack.Screen name="ListaTarefas" component={ListaTarefasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

