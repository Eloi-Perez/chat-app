import React from 'react';
import { ImageBackground, View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';


export default function Start({ navigation: { navigate } }) {
    const [name, setName] = React.useState("");
    const [mycolor, setMycolor] = React.useState("");

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground source={require('../assets/background.png')} resizeMode="cover" style={styles.background} >
                <Text style={styles.text}>Hello!</Text>
                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="enter your name please"
                        onSubmitEditing={() => navigate('Chat', { name: name, mycolor: mycolor })}
                    />
                    <Text style={styles.selectorText}>Choose your background colour</Text>
                    <View style={styles.selectorsView}>
                        <View style={styles.selectorsContainer}>
                            <TouchableOpacity
                                style={[styles.selector, { backgroundColor: '#090C08' }]}
                                onPress={() => setMycolor('#090C08')}
                            />
                        </View>
                        <View style={styles.selectorsContainer}>
                            <TouchableOpacity
                                style={[styles.selector, { backgroundColor: '#474056' }]}
                                onPress={() => setMycolor('#474056')}
                            />
                        </View>
                        <View style={styles.selectorsContainer}>
                            <TouchableOpacity
                                style={[styles.selector, { backgroundColor: '#8A95A5' }]}
                                onPress={() => setMycolor('#8A95A5')}
                            />
                        </View>
                        <View style={styles.selectorsContainer}>
                            <TouchableOpacity
                                style={[styles.selector, { backgroundColor: '#B9C6AE' }]}
                                onPress={() => setMycolor('#B9C6AE')}
                            />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Button
                            title="Go to Chat"
                            onPress={() => navigate('Chat', { name: name, mycolor: mycolor })}
                            color="#8A95A5"
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
        justifyContent: "space-around",
    },
    containerInput: {
        backgroundColor: '#fff',
        width: '88%',
        alignSelf: "center",
        padding: 15,
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
        borderColor: "#8A95A5",
        borderWidth: 2,
        width: "100%",
        textAlign: "center",
    },
    selectorText: {
        color: "#8A95A5",
        textAlign: "center",
        paddingTop: 30,
        paddingBottom: 8,
    },
    selectorsView: {
        alignSelf: "center",
        flexDirection: 'row',
    },
    selectorsContainer: {
        padding: 2,
    },
    selector: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    button: {
        paddingTop: 30,
        alignSelf: "center",
        width: "100%",
    },
});