import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../utils/Colors'
import CommonCompo from './CommonCompo'

const MyDriveScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgroundColor}}>
      <CommonCompo screenType={'home'} navigation={navigation} extraParams={{recentOnly: true}}/>

    </SafeAreaView>
  )
}

export default MyDriveScreen

const styles = StyleSheet.create({})