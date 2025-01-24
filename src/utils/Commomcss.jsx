import { StyleSheet } from "react-native";
import { COLORS } from "./Colors";

export const commonStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingHorizontal: 15,
  },heading:{
    fontSize:18,
    color:COLORS.black,
    fontWeight:'600'
  }
});
