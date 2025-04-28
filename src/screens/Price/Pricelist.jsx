import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Button, Touchable, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/Colors'; // Assuming you have a COLORS utility
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { useSelector } from 'react-redux';
import strings from '../../helper/Language/LocalizedStrings';
import axios from 'axios';
import { baseURL } from '../../utils/constant/settings';
import { date } from 'yup';

const pricelistData = [
  {
    id: 1,
    title: 'ConiaCloud Drive Basic',
    usdPrice: '$5.00/m',
    liraPrice: '175.00₺/m',
    features: [
        strings.STOREGESPACE25GB,
        strings.LICENCEINCLUDED,
        strings.SHAREWITHULTIMATEDCONIAUSER,
        strings.CONIACLUDFEATURES,
        strings.CONIAEXTRAMEMBER,
        strings.ACCESSTOCONIACLOUDEXPERTIES,
        strings.FILEUPLADANDDOWNLOAD,
       strings.BASICFIELSYNCANDSHARING,
       strings.ACCESSFILESFROMANYDEVICE,
       strings.AUTOMATICBACKUP,
        strings.FILEPREVIEFUNCTIONALITY
    ],
  },
  {
    id: 2,
    title: 'ConiaCloud Drive S',
    usdPrice: '$8.00/m',
    liraPrice: '280.00₺/m',
    features: [
        strings.STOREGESPACE25GB,
        strings.LICENCEINCLUDED,
        strings.SHAREWITHULTIMATEDCONIAUSER,
        strings.CONIACLUDFEATURES,
        strings.CONIAEXTRAMEMBER,
        strings.ACCESSTOCONIACLOUDEXPERTIES,
        strings.FILEUPLADANDDOWNLOAD,
       strings.BASICFIELSYNCANDSHARING,
       strings.ACCESSFILESFROMANYDEVICE,
       strings.AUTOMATICBACKUP,
        strings.FILEPREVIEFUNCTIONALITY
    ],
  },
  {
    id: 3,
    title: 'ConiaCloud Drive M',
    usdPrice: '$15.00/m',
    liraPrice: '525.00₺/m',
    features: [
        strings.STOREGESPACE25GB,
        strings.LICENCEINCLUDED,
        strings.SHAREWITHULTIMATEDCONIAUSER,
        strings.CONIACLUDFEATURES,
        strings.CONIAEXTRAMEMBER,
        strings.ACCESSTOCONIACLOUDEXPERTIES,
        strings.FILEUPLADANDDOWNLOAD,
       strings.BASICFIELSYNCANDSHARING,
       strings.ACCESSFILESFROMANYDEVICE,
       strings.AUTOMATICBACKUP,
        strings.FILEPREVIEFUNCTIONALITY
    ],
  },
  {
    id: 4,
    title: 'ConiaCloud Drive L',
    usdPrice: '$27.00/m',
    liraPrice: '945.00₺/m',
    features: [
        strings.STOREGESPACE25GB,
        strings.LICENCEINCLUDED,
        strings.SHAREWITHULTIMATEDCONIAUSER,
        strings.CONIACLUDFEATURES,
        strings.CONIAEXTRAMEMBER,
        strings.ACCESSTOCONIACLOUDEXPERTIES,
        strings.FILEUPLADANDDOWNLOAD,
       strings.BASICFIELSYNCANDSHARING,
       strings.ACCESSFILESFROMANYDEVICE,
       strings.AUTOMATICBACKUP,
        strings.FILEPREVIEFUNCTIONALITY
    ],
  },
  {
    id: 5,
    title: 'ConiaCloud Drive XL',
    usdPrice: '$60.00/m',
    liraPrice: '2100.00₺/m',
    features: [
        strings.STOREGESPACE25GB,
        strings.LICENCEINCLUDED,
        strings.SHAREWITHULTIMATEDCONIAUSER,
        strings.CONIACLUDFEATURES,
        strings.CONIAEXTRAMEMBER,
        strings.ACCESSTOCONIACLOUDEXPERTIES,
        strings.FILEUPLADANDDOWNLOAD,
       strings.BASICFIELSYNCANDSHARING,
       strings.ACCESSFILESFROMANYDEVICE,
       strings.AUTOMATICBACKUP,
        strings.FILEPREVIEFUNCTIONALITY
    ],
  },
  {
    id: 6,
    title: 'ConiaCloud Drive XXL',
    usdPrice: '$108.00/m',
    liraPrice: '3780.00₺/m',
    features: [
      strings.STOREGESPACE25GB,
      strings.LICENCEINCLUDED,
      strings.SHAREWITHULTIMATEDCONIAUSER,
      strings.CONIACLUDFEATURES,
      strings.CONIAEXTRAMEMBER,
      strings.ACCESSTOCONIACLOUDEXPERTIES,
      strings.FILEUPLADANDDOWNLOAD,
     strings.BASICFIELSYNCANDSHARING,
     strings.ACCESSFILESFROMANYDEVICE,
     strings.AUTOMATICBACKUP,
      strings.FILEPREVIEFUNCTIONALITY
    ],
  },
];

const Pricelist = ({ navigation }) => {
  const [currency, setCurrency] = useState('TRY'); 
  const [feature,setFeature]=useState([])
  const user = useSelector(state => state.auth.user);
  const [isLoading,setIsLoading]=useState(false)
  // const language = useSelector(state => state.language.language);

  const handlePriceList=async()=>{
    setIsLoading(true)
    try {
      // const res=await axios.get(`${baseURL}billing/products`)
      const res=await axios.get(`${baseURL}/billing/products`)
      // console.log('respoce ki Information3---->>>>>',res?.data?.pagination?.data)
      setFeature(res?.data?.pagination?.data)

    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  useEffect(()=>{
  handlePriceList()
  },[])
 
  const hanndleSUbsbutton=(item)=>{
    navigation.navigate('ViewPriceProduct',{item,currency})
    // Alert.alert('Working On It Thanks For Buying Product')
  }
  
  const toggleCurrency = () => {
    setCurrency((prevCurrency) => (prevCurrency === 'TRY' ? 'EUR':'TRY' ));
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex:1,padding:15}}>

        
      <CustomHeader back={true}   OnPress={() => navigation.goBack()} title={strings.PRICE_LIST}left={true} />
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Price & Feature List in {currency === 'TRY' ? '€ ' : '₺'}
          </Text>
          <TouchableOpacity style={{padding:15,backgroundColor:COLORS.BUTTON,borderRadius:10}}
                      onPress={toggleCurrency}>
            <Text style={{fontSize:14,color:COLORS.white,fontWeight:'600'}}>
            {`Switch to ${currency === 'TRY' ? 'Turkish Lira (₺)' : 'EUR € '}`}
            </Text>
          </TouchableOpacity>
          {/* <Button
            title={`Switch to ${currency === 'USD' ? 'Turkish Lira (₺)' : 'EUR € '}`}
            onPress={toggleCurrency}
            /> */}
        </View>
          { isLoading ?<ActivityIndicator size={'large'} color={COLORS.blue}/>: <ScrollView contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>

        {/* {pricelistData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>
              {currency === 'USD' ? item.usdPrice : item.liraPrice}
            </Text>
            <View style={styles.divider} />
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureContainer}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.feature}>{feature}</Text>
              </View>
            ))}
            <View style={{width:'80%',alignSelf:'center',padding:15}}>
            <CustomButton buttonTitle="Get Started" onPress={()=>navigation.navigate('UpgradeScreen')} />
            </View>
          
          </View>
        ))} */}
       {feature.map((item, index) => (
  <View key={item?.id || index} style={{ ...styles.card }}>
    <Text style={{ ...styles.title }}>{item.name}</Text>

    {/* Mapping prices correctly */}

{item.prices.length > 0 ? (
  <Text style={{...styles.price}}>
    {currency === 'TRY'
      ? ` € ${item.prices.find(p => p.currency === 'EUR')?.amount || 'N/A'} /Year  +Tex Including`
      : `₺ ${item.prices.find(p => p.currency === 'TRY')?.amount || 'N/A'} /Year +Tex Including`}
  </Text>
) : (
  <Text style={{color:COLORS.black}}>No Pricing Data</Text>
)}

{/* 
    <Text>{item.price}</Text> */}
    {/* <Text style={{...styles.feature}}>{item.available_space}</Text> */}
    {/* <Text style={{...styles.headerText}}>{(item.available_space / (1024 ** 3)).toFixed(2)} GB</Text> */}

    {/* Mapping feature_list correctly */}
    <Text style={{fontSize:18,color:COLORS.black,fontWeight:'700',paddingVertical:8}}>What's included</Text>
    {item.feature_list?.map((featureItem, featureIndex) => (
      <Text key={featureIndex} style={styles.feature}>✅  {featureItem}</Text>
    ))} 
    <View style={{paddingVertical:25}}>

    <CustomButton buttonTitle="Subscribe" onPress={() => hanndleSUbsbutton(item)} />

    </View>
  </View>
))}

      </ScrollView>}
      </View>
    </SafeAreaView>
  );
};

export default Pricelist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor || '#f5f5f5',
  },
  content: {
    // padding: 15,
    alignItems: 'center',
  },
  header: {
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black || '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary || '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.blue || '#007BFF',
    // marginBottom: 10,
  },
  divider: {
    borderBottomColor: COLORS.faint || '#ddd',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  featureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkmark: {
    color: 'green',
    fontSize: 16,
    marginRight: 5,
  },
  feature: {
    fontSize: 16,
    color: '#555',
    fontyeight: '500',
    marginBottom: 5,
  },
});
