import React, { useState, useCallback, useEffect, useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useGetFileFolderQuery } from "../../redux/reducers/services/filefolderApi";
import MyDriveScreen from "./MyDriveScreen";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonCompo from "./CommonCompo";

const Sharedscreen = ({navigation,extraParams}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [folderHistory, setFolderHistory] = useState([0]);
  const workspaces = useSelector(state => state.workspace.workspace);
  const [sortingInfo, setSortingInfo] = useState({
    sortBy: 'updated_at',
    sortDir: 'desc',
  });
  const params = useMemo(() => ({
    query: searchQuery, 
    pageId: 0, 
    folderId: folderHistory[folderHistory.length - 1],
    page: 1,
    workspaceId: workspaces || 0,
    per_page: 100,
    orderBy: sortingInfo.sortBy,
    orderDir: sortingInfo.sortDir,
    filters: selectedFilter,
    ...extraParams
  }), [folderHistory, sortingInfo, workspaces, selectedFilter,searchQuery]); 
  
    const { data, error, isLoading, refetch } = useGetFileFolderQuery(params);
    console.log(data)
  return (
    <SafeAreaView style={{flex:1}}>
        
      

 {/* <MyDriveScreen extraParams={{ sharedOnly: true }} navigation={navigation} /> */}
 <CommonCompo  extraParams={{ sharedOnly: true }}  navigation={navigation}/>

    </SafeAreaView>
  )
}

export default Sharedscreen

const styles = StyleSheet.create({})