import React from 'react';
import { ImageBackground, View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';


export default function Start({ navigation: { navigate } }) {
    const [name, onChangeName] = React.useState("");
    const [mycolor, onChangemycolor] = React.useState("");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.image} >
                <Text style={styles.text}>Hello!</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="your Name please"
                        onSubmitEditing={() => navigate('Chat', { name: name, mycolor: mycolor })}
                />
                <View style={styles.selectorsview}>
                    <TouchableOpacity
                        style={[styles.selector, { backgroundColor: '#090C08' }]}
                        onPress={() => onChangemycolor('#090C08')}
                    />
                    <TouchableOpacity
                        style={[styles.selector, { backgroundColor: '#474056' }]}
                        onPress={() => onChangemycolor('#474056')}
                    />
                    <TouchableOpacity
                        style={[styles.selector, { backgroundColor: '#8A95A5' }]}
                        onPress={() => onChangemycolor('#8A95A5')}
                    />
                    <TouchableOpacity
                        style={[styles.selector, { backgroundColor: '#B9C6AE' }]}
                        onPress={() => onChangemycolor('#B9C6AE')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Go to Chat"
                        onPress={() => navigate('Chat', { name: name, mycolor: mycolor })}
                    />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    image: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    text: {
        color: "white",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: "bold",
        textAlign: "center",
    },
    input: {
        alignSelf: "center",
        height: 40,
        borderColor: "gray",
        borderWidth: 2,
        width: "40%",
        textAlign: "center",
    },
    button: {
        paddingTop: 10,
        alignSelf: "center",
        width: "40%",
    },
    selectorsview: {
        alignSelf: "center",
        flexDirection: 'row',
        padding: 20,
    },
    selector: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});