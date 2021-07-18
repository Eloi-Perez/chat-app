import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Chat(props) {
    const navigation = useNavigation();
    const { name, mycolor } = props.route.params;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name,  // title: name === '' ? 'No title' : name,
        });
    }, [navigation, name]);

    return (
        <View style={[styles.container, { backgroundColor: mycolor }]}>
            <Text>Hello {name}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});