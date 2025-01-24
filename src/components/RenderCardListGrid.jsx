import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import React from 'react';
import { COLORS } from '../utils/Colors';
import { timeAgo } from '../helper/functionHelper';
import { fileColorCode } from '../utils/constant/settings';

const { width } = Dimensions.get('window'); 

const RenderCardListGrid = ({ item, isGrid,onPress ,getIcon,action}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
         
        { 
          width: isGrid ? width / 2 -22 : width - 30,
          margin: isGrid ? 5 : 0,
        }
      ]}
    onPress={onPress}>
      
      {isGrid ?
             <View style={{...styles.gridContent}}>
              <View style={{...styles.moreimgcontainer}}>

 <View style={styles.iconContainer}>
  
               <Image 
                 source={getIcon} 
                 style={styles.img} 
               />
             </View>
             <TouchableOpacity style={{...styles.iconContainer,height:36,width:36}}>
               <Image 
                 source={require('../assets/MoreOption.png')} 
                 style={{...styles.img,height:20,width:20}} 
               />
             </TouchableOpacity>
              </View>
             <Text style={styles.title}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name || "Title Placeholder"}</Text>
               <Text style={styles.subtitle}>{timeAgo(item.created_at)|| "time ago"}</Text>
             
             </View>
             : <View style={styles.content}>
             {/* Left Icon */}
             <View style={styles.iconContainer}>
               <Image 
                  source={getIcon} 
                 style={styles.img} 
               />
               
             </View>
     
             {/* Middle Text */}
             <View style={styles.textContainer}>
               <Text style={styles.title}>{item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name || "Title Placeholder"}</Text>
               <Text style={styles.subtitle}>{timeAgo(item.created_at)|| "Subtitle Placeholder"}</Text>
             </View>
     
             {/* Right Icon */}
             <TouchableOpacity style={{}} onPress={action}>
               <Image 
                 source={require('../assets/MoreOption.png')} 
                 style={[styles.moreicon, { height: 20, width: 20,tintColor:fileColorCode[Math.floor(Math.random() * 4)] }]}
               />
             </TouchableOpacity>
           </View>}
    </TouchableOpacity>
  );
};

export default RenderCardListGrid;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: COLORS.orenge, // Optional background for better visibility
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  img: {
    height: '65%',
    width: '65%',
    resizeMode: 'contain',
    tintColor:COLORS.white,
  },
  gridContent:{
   
  },
  moreimgcontainer:{
    flexDirection:'row',justifyContent:'space-between'
  }
});
