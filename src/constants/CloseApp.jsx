import { BackHandler, Alert } from 'react-native';

const closeApp = () => {
    Alert.alert(
        "Exit App",
        "Network Error occurred. Do you want to close the app?",
        [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => BackHandler.exitApp() }
        ]
    );
};
export default closeApp