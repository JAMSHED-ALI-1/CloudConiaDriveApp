import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyDriveScreen from './MyDriveScreen'
import CommonCompo from './CommonCompo'

const TrashScreen = ({navigation,trash}) => {
  return (
    <SafeAreaView style={{flex:1}}>
     {/* <MyDriveScreen extraParams={{ deletedOnly: true }} navigation={navigation}  /> */}
     <CommonCompo  extraParams={{ deletedOnly: true }}  navigation={navigation} screenType={'trash'}/>
    </SafeAreaView>
  )
}

export default TrashScreen

const styles = StyleSheet.create({})