import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>

            <Stack.Navigator
                initialRouteName="Start"
            >
                <Stack.Screen
                    name="Start"
                    component={Start}
                />
                <Stack.Screen
                    name="Chat"
                    component={Chat}
                />
            </Stack.Navigator>
        </NavigationContainer>


    );
}

const styles = StyleSheet.create({
    // container: {
    //   flex: 1,
    //   flexDirection: 'column',
    // },
});
