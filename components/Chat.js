import React from 'react';
import { View, Text } from 'react-native';


export default function Chat(props) {
    const { name } = props.route.params;
    props.navigation.setOptions({ title: name })
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Hello {name}</Text>
        </View>
    )

}