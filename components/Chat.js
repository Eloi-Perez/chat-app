import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

export default function Chat(props) {
    const navigation = useNavigation();
    const { name, mycolor } = props.route.params;

    const [messages, setMessages] = React.useState([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name,  // title: name === '' ? 'No title' : name,
        });
    }, [navigation, name]);

    React.useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ])
    }, []);

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
                left: {},
                right: { backgroundColor: '#000' },
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
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    };

    return (
        // <View style={[styles.container, { backgroundColor: mycolor }]}>
        <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{
                _id: 1,
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