import React from 'react';
import { LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env'

LogBox.ignoreLogs(['Setting a timer']);
// LogBox.ignoreAllLogs();

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// initialize Firebase Firestore
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
// select DB Collection
const referenceChatMessages = firebase.firestore().collection('messages');

const offlineMsg = {
    _id: 1,
    text: 'You are Offline',
    createdAt: new Date(),
    system: true,
}

export default function Chat(props) {
    const navigation = useNavigation();
    const { name, mycolor } = props.route.params;

    const [messages, setMessages] = React.useState([]);
    const [loggedInText, setLoggedInText] = React.useState('Welcome ' + name);
    const [uid, setUid] = React.useState(0);
    const [online, setOnline] = React.useState(true);

    // title update
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: loggedInText,  // title: name === '' ? 'No title' : name, //loggedInText
        });
    }, [navigation, loggedInText]);

    // load system offline message
    React.useEffect(() => {
        let msgs = messages;
        let index = msgs.indexOf(offlineMsg);
        if (index > -1) {
            if (online) {
                msgs.splice(index, 1);
                setMessages(msgs);
            }
        } else {
            if (!online) {
                msgs.unshift(offlineMsg);
                setMessages(msgs);
            }
        }
    }, [online, messages]);

    // From Local DB to State
    const getMessages = async () => {
        let toMessages = '';
        let toUid = '';
        try {
            toMessages = await AsyncStorage.getItem('messages') || [];
            setMessages(JSON.parse(toMessages));
            toUid = await AsyncStorage.getItem('uid');
            setUid(toUid);
        } catch (e) {
            console.error(e);
        }
    };

    // From State to Local DB
    const saveMessages = async () => {
        try {
            if (messages) { await AsyncStorage.setItem('messages', JSON.stringify(messages)); }
        } catch (e) {
            console.error(e);
        }
    };
    React.useEffect(() => { saveMessages() }, [messages]);

    // firestore listening function
    const firestoreConnection = () => firebase.auth().onAuthStateChanged(async (user) => {
        let previousText = loggedInText;
        setLoggedInText('Loading...');
        if (!user) { await firebase.auth().signInAnonymously(); }
        setUid(user.uid);
        await AsyncStorage.setItem('uid', user.uid);
        referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(querySnapshot => {
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
        setLoggedInText(previousText);
    });

    // loading messages and online status
    React.useEffect(() => {
        getMessages();
        const netStateSubscription = NetInfo.addEventListener(async (netState) => {
            // console.log("Connection type", netState.type);
            console.log("Is connected?", netState.isConnected);
            setOnline(netState.isConnected);
            if (netState.isConnected) { firestoreConnection() }
        });
        // stop listening on unmount
        return () => { netStateSubscription(); }
    }, []); // once

    // input send to firestore + State
    const onSend = (newMessages = []) => {
        newMessages.map(msg => referenceChatMessages.add(msg));
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    };

    // dev delete local messages
    const deleteMessages = async () => {
        try {
            await AsyncStorage.removeItem('messages');
            setMessages([])
        } catch (e) {
            console.error(e);
        }
    };
    // deleteMessages();

    // hide input when offline
    const renderInputToolbar = (props) => {
        if (online) {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    };

    //GiftedChat styles
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
                left: { backgroundColor: '#e6dc6e' },
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

    return (
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: uid,
                name: name,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            messagesContainerStyle={{ backgroundColor: mycolor }}
        />
    )

}