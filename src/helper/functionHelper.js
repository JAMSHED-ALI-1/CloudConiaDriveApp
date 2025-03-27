import AsyncStorage from "@react-native-async-storage/async-storage";

export const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now - past; 
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years > 0) {
      return years + (years === 1 ? " year ago" : " years ago");
    } else if (months > 0) {
      return months + (months === 1 ? " month ago" : " months ago");
    } else if (weeks > 0) {
      return weeks + (weeks === 1 ? " week ago" : " weeks ago");
    } else if (days > 0) {
      return days + (days === 1 ? " day ago" : " days ago");
    } else if (hours > 0) {
      return hours + (hours === 1 ? " hour ago" : " hours ago");
    } else if (minutes > 0) {
      return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
    } else {
      return seconds + (seconds === 1 ? " second ago" : " seconds ago");
    }
  }


  export const storeData = async (value) => {
    try {
      const userInfo = JSON.stringify(value);
      await AsyncStorage.setItem('user', userInfo);
    } catch (e) {
      console.log('err From AsyncStorage',e)
    }
  };

 export const getData = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('user');
      return userInfo != null ? JSON.parse(userInfo) : null;
    } catch (e) {
      console.log(e)
      return null;
    }
  };