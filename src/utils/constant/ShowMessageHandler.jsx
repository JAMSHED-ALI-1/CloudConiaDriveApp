import { showMessage } from "react-native-flash-message";
import { COLORS } from "../Colors";

 // Helper function to display flash messages
 const showMessageHandler = (message, description, type) => {
    showMessage({
      message,
      description,
      type,
      icon: type, 
      duration: 3000,
      backgroundColor: COLORS.blue, 
      hideOnPress: true,
    });
  };
  export default showMessageHandler