import React from 'react';
import { LogBox, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import Lightbox from 'react-native-lightbox-v2';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

import { API_KEY, PROJECT_ID, MESSAGING_SENDER_ID, APP_ID } from '@env'
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

LogBox.ignoreLogs(['Setting a timer']);
// LogBox.ignoreAllLogs();

import MapView, { Marker } from 'react-native-maps';
import CustomActions from './CustomActions';


// initialize Firebase Firestore
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
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
    const firestoreConnection = async () => {
        const auth = getAuth();
        signInAnonymously(auth)
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                let previousText = loggedInText;
                setLoggedInText('Loading...');
                setUid(user.uid);
                await AsyncStorage.setItem('uid', user.uid);
                referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(querySnapshot => {
                    const toMessages = [];
                    querySnapshot.forEach((doc) => {
                        let data = doc.data();
                        toMessages.push({
                            _id: data._id,
                            text: data.text || null,
                            createdAt: data.createdAt.toDate(),
                            user: {
                                _id: data.user._id,
                                name: data.user.name,
                                avatar: data.user.avatar || null,
                            },
                            image: data.image || null,
                            location: data.location || null,
                        });
                    });
                    setMessages(toMessages);
                });
                setLoggedInText(previousText);
            }
        });
    }

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
        return () => { netStateSubscription(); console.log('unmounted NetInfo'); }
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


    // Pattern to send media messages
    const onSendFromUser = (messages = []) => {
        const createdAt = new Date();
        const messagesToUpload = messages.map(msg => {
            return msg = {
                _id: uuidv4(),
                text: msg.text || null,
                createdAt: createdAt,
                user: {
                    _id: uid,
                    name: name,
                    avatar: `https://ui-avatars.com/api/?background=random&name=${name}`,
                },
                image: msg.image || null,
                location: msg.location || null,
            }
        })
        onSend(messagesToUpload)
        // const messagesToUpload = messages.map(message => ({
        //     ...message,
        //     user,
        //     createdAt,
        //     _id: Math.round(Math.random() * 1000000),
        // }))
    }
    const renderCustomActions = props =>
        Platform.OS === 'web' ? null : (
            <CustomActions {...props} onSend={onSendFromUser} />
        )

    const renderCustomView = props => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentMessage.location.latitude,
                            longitude: currentMessage.location.longitude
                        }}
                    />
                </MapView>
            );
        }
        return null;
    }


    return (
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: uid,
                name: name,
                avatar: `https://ui-avatars.com/api/?background=random&name=${name}` // make selectable in start
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            messagesContainerStyle={{ backgroundColor: mycolor }}
            renderActions={renderCustomActions}
            renderCustomView={renderCustomView}
            messageIdGenerator={uuidv4}
        // renderUsernameOnMessage={true}
        />
    )

}