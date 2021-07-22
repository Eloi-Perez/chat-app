import React from 'react';
import { View, Text, StyleSheet, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env'

LogBox.ignoreLogs(['Setting a timer']);

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const referenceChatMessages = firebase.firestore().collection('messages');

export default function Chat(props) {
    const navigation = useNavigation();
    const { name, mycolor } = props.route.params;

    const [messages, setMessages] = React.useState([]);
    const [loggedInText, setLoggedInText] = React.useState('Please wait, you are getting logged in');
    const [uid, setUid] = React.useState(0);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name,  // title: name === '' ? 'No title' : name, //loggedInText
        });
    }, [navigation, name, loggedInText]);

    React.useEffect(() => {
        async function firebaseconnection() {
            try {
                await firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        await firebase.auth().signInAnonymously();
                    }
                    setUid(user.uid);
                    setLoggedInText('Hello ' + user.uid);
                    await referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(querySnapshot => { //.where("uid", "==", user.uid)
                        const toMessages = [];
                        querySnapshot.forEach((doc) => {
                            let data = doc.data();
                            toMessages.push({
                                _id: data._id,
                                text: data.text,
                                createdAt: data.createdAt.toDate(),
                                user: data.user,
                            });
                        });
                        setMessages(toMessages);
                    });
                });
            } catch (e) {
                console.error(e);
            }
        }; firebaseconnection();
        //stop listening on unmount
        return () => { firebaseconnection(); }
    }, []); //once

    const renderBubble = (props) => (
        <Bubble
            {...props}
            // renderTime={() => <Text>Time</Text>}
            // renderTicks={() => <Text>Ticks</Text>}
            // containerStyle={{
            //     left: { borderColor: 'teal', borderWidth: 8 },
            //     right: {},
            // }}
            wrapperStyle={{
                left: { backgroundColor: '#e6dc6e'},
                right: { backgroundColor: '#6ed6e6' },
            }}
        // bottomContainerStyle={{
        //     left: { borderColor: 'purple', borderWidth: 4 },
        //     right: {},
        // }}
        // tickStyle={{}}
        // usernameStyle={{ color: 'tomato', fontWeight: '100' }}
        // containerToNextStyle={{
        //     left: { borderColor: 'navy', borderWidth: 4 },
        //     right: {},
        // }}
        // containerToPreviousStyle={{
        //     left: { borderColor: 'mediumorchid', borderWidth: 4 },
        //     right: {},
        // }}
        />
    );

    const onSend = (newMessages = []) => {
        newMessages.map(msg => referenceChatMessages.add(msg));
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    };

    return (
        // <View style={[styles.container, { backgroundColor: mycolor }]}>
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: uid,
                name: name,
            }}
            renderBubble={renderBubble}
        />
        // </View>
    )

}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
});