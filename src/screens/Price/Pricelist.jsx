import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { COLORS } from '../../utils/Colors'; // Assuming you have a COLORS utility
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { useSelector } from 'react-redux';
import strings from '../../helper/Language/LocalizedStrings';

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
  const [currency, setCurrency] = useState('USD'); 
  const language = useSelector((state) => state.language.language);
  console.log(language)
  useEffect(() => {
    strings.setLanguage(language); 
  }, [language]);
  const toggleCurrency = () => {
    setCurrency((prevCurrency) => (prevCurrency === 'USD' ? 'TRY' : 'USD'));
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{flex:1,paddingHorizontal:15}}>

        
      <CustomHeader back={true}   OnPress={() => navigation.goBack()} title="Price List" left={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Price & Feature List in {currency === 'USD' ? '$' : '₺'}
          </Text>
          <Button
            title={`Switch to ${currency === 'USD' ? 'Turkish Lira (₺)' : 'USD $'}`}
            onPress={toggleCurrency}
          />
        </View>

        {pricelistData.map((item) => (
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
        ))}
      </ScrollView>
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
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.blue || '#333',
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary || '#007BFF',
    marginBottom: 10,
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
    fontSize: 14,
    color: '#555',
  },
});
