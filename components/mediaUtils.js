import { Linking } from 'expo'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';



export default async function getPermissionAsync(permKey) {
    const permission = () => {
        switch (permKey) {
            case 'location':
                return Location.requestForegroundPermissionsAsync();
            case 'storage':
                return ImagePicker.requestMediaLibraryPermissionsAsync();
            case 'camera':
                return ImagePicker.getCameraPermissionsAsync();
        }
    }
    const { status } = await permission();
    if (status !== 'granted') {
        Alert.alert(
            'Cannot be done 😞',
            `If you would like to use this feature, you'll need to enable the ${permKey} permission in your phone settings.`,
            [
                {
                    text: "Let's go!",
                    onPress: () => Linking.openSettings(),
                },
                { text: 'Nevermind', onPress: () => { }, style: 'cancel' },
            ],
            { cancelable: true },
        )
        return false
    }
    return true
}

export async function getLocationAsync(onSend) {
    if (await getPermissionAsync('location')) {
        const location = await Location.getCurrentPositionAsync({})
        if (location) {
            onSend([{ location: location.coords }])
        }
    }
}

export async function pickImageAsync(onSend) {
    if (await getPermissionAsync('storage')) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
        })

        if (!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            onSend([{ image: imageUrl }])
            return imageUrl
        }
    }
}

export async function takePictureAsync(onSend) {
    if (await getPermissionAsync('camera')) {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
        })

        if (!result.cancelled) {
            const imageUrl = await this.uploadImageFetch(result.uri);
            onSend([{ image: imageUrl }])
            return imageUrl
        }
    }
}

// uploads images to Firebase in blob format
uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
};