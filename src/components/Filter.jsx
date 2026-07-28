import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/Colors';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Filter = ({ FilterData, selectedFilter, handleFilterSelect }) => {
  console.log(FilterData.title,'')
  return (
    <ScrollView horizontal style={{ padding:10 }} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
          {FilterData.map((item, id) => (
            <TouchableOpacity 
              key={id} 
              style={{
                ...styles.filterItemContainer,
                ...(selectedFilter === item.filters ? styles.selectedFilter : {}),
                backgroundColor:item.backgroundColor
              }}
              onPress={() => handleFilterSelect(item.filters)} 
            >
              <Image source={item.Image} style={styles.folderIcon} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
  )
}

export default Filter

const styles = StyleSheet.create({
    horizontalContainer: {
        flexDirection: 'row',
      },
      folderIcon: {
        height: windowHeight * 0.04, 
        width: windowWidth * 0.11, 
        marginBottom: windowHeight * 0.01,
        resizeMode: 'contain',
      },
    filterItemContainer: {
        alignItems: 'center',
        marginRight: 10, 
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 10,
        // width: windowWidth * 0.2,
        // height: windowHeight * 0.11,
      },
      selectedFilter: {
        backgroundColor: COLORS.DriveColor,
      },
      itemContainer: {
        height: 40,
        backgroundColor: COLORS.DriveColor,
        marginBottom: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
      },
      backButton: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 5,
      },
      goBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
      },
      itemTitle:{
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 5,
      }
})