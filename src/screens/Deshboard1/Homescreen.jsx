import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Test from '../../../Test'
import axios from 'axios'
import { baseURL } from '../../utils/constant/settings'
import MyDriveScreen from './MyDriveScreen'
import HomeHeader from '../../components/HomeHeader'
import { useSelector } from 'react-redux'
import CommonCompo from './CommonCompo'

const Homescreen = ({navigation}) => {

  const user = useSelector(state => state.auth.user);


  return (
    <View style={{flex:1}}>
 
      {/* <Test upladActive={true} navigation={navigation}/> */}
      <CommonCompo navigation={navigation} upladActive={true} screenType="home" workspace={true}/>
      {/* <MyDriveScreen navigation={navigation} upladActive={true}/> */}
    </View>
  )
}

export default Homescreen

const styles = StyleSheet.create({})