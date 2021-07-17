import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function Start({ navigation: { navigate } }) {
    const [name, onChangeName] = React.useState("");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Hello!</Text>
            <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={onChangeName}
                value={name}
                placeholder="your Name please"
            />
            <Button
                title="Go to Chat"
                onPress={() => navigate('Chat', {name: name})}
            />
        </View>
    )
}