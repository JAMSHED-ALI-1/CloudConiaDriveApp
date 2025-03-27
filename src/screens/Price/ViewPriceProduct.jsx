// import { Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { baseURL } from '../../utils/constant/settings';
// import CustomHeader from '../../components/CustomHeader';
// import { COLORS } from '../../utils/Colors';
// import strings from '../../helper/Language/LocalizedStrings';
// import CustomButton from '../../components/CustomButton';

// const ViewPriceProduct = ({ route, navigation }) => {
//     const { item ,currency} = route.params;
//     console.log('Currency on ViewPriceProduct screen:', currency);
//     const user = useSelector((state) => state.auth.user);
//     const [modalVisible, setModalVisible] = useState(false);
//     // const [currency, setCurrency] = useState('TRY');  // Default currency set to TRY

//     const getApiHeaders = (token) => ({
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         'X-Client-Type': 'mobile',
//     });

//     // API Call to get Iyzico token
//     const handleIzeco = async () => {
//         try {
//             const response = await axios.post(
//                 `${baseURL}/payment/iyzico/token`,
//                 {
//                     'X-Client-Type': 'mobile',
//                     product_id: item?.id,
//                     currency: currency,
//                 },
//                 { headers: getApiHeaders(user?.access_token) }
//             );
//             console.log("Iyzico Response--->>>:", response);
//         } catch (error) {
//             console.error("Error-->>:", error.response?.data || error.message);
//         }
//     };

//     // Handle effect on component mount
//     useEffect(() => {
//         // Optionally you can invoke handleIzeco if you want the API call to be made when the component is mounted.
//         // handleIzeco();
//     }, [currency]);  // Run this effect when currency changes

//     // Calculate space in GB (if available)
//     const availableSpaceGB = (item?.available_space / (1024 ** 3)).toFixed(2); // Convert to GB

//     // Find the price for the selected currency
//     const price = item?.prices?.find(p => p.currency === currency)?.amount || 'N/A';

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundColor }}>
//             <View style={styles.container}>
//                 <CustomHeader
//                     back={true}
//                     OnPress={() => navigation.goBack()}
//                     title={strings.PRICE_LIST}
//                     left={true}
//                 />
//                 <View style={{...styles.card}}>

//                    <Text style={styles.productName}>Summery</Text>
//                 {/* Display Name */}
//                 <Text style={styles.productName}>{item?.name}</Text>

//                 {/* Display Available Space */}
//                 <Text style={styles.spaceText}>Available Space: {availableSpaceGB} GB</Text>

//                 {/* Display Feature List */}
//                 {item?.feature_list?.map((feature, index) => (
//                     <Text key={index} style={styles.featureText}>• {feature}</Text>
//                 ))}

//                 {/* Display Pricing */}
//                 <Text style={styles.priceText}>
//                     {/* {currency === 'TRY'
//                         ? `₺ ${price} /Year`
//                         : `€ ${price} /Year`} */}

// {item.prices.length > 0 ? (
//   <Text style={{...styles.price}}>
//     {currency === 'USD'
//       ? ` € ${item.prices.find(p => p.currency === 'EUR')?.amount || 'N/A'} /Year `
//       : `₺ ${item.prices.find(p => p.currency === 'TRY')?.amount || 'N/A'} /Year`}
//   </Text>
// ) : (
//   <Text style={{color:COLORS.black}}>No Pricing Data</Text>
// )}
//                 </Text>
//                 </View>

//              <View style={{...styles.flexDirection}}>

//                 <Text style={{...styles.productName}}>Total Pay:</Text>
//                 {item.prices.length > 0 ? (
//   <Text style={{...styles.productName}}>
//     {currency === 'USD'
//       ? ` € ${item.prices.find(p => p.currency === 'EUR')?.amount || 'N/A'}  `
//       : `₺ ${item.prices.find(p => p.currency === 'TRY')?.amount || 'N/A'} `}
//   </Text>
// ) : (
//   <Text style={{color:COLORS.black}}>No Pricing Data</Text>
// )}
//              </View>
//                 <View style={{marginTop:20}}>

//                 <CustomButton buttonTitle={'Pay'}/>
//                 </View>
//             </View>
//     {/* <Modal>

//     </Modal> */}

//         </SafeAreaView>
//     );
// };

// export default ViewPriceProduct;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 15,
//         backgroundColor:COLORS.backgroundColor
//     },
//     card:{
//  padding:10,
//  backgroundColor:COLORS.white,
//  borderRadius:10,
//  marginTop:20,
//  shadowColor: COLORS.blue,
// shadowOffset: {
// 	width: 0,
// 	height: 5,
// },
// shadowOpacity: 0.36,
// shadowRadius: 6.68,

// elevation: 11,
//     },
//     productName: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     spaceText: {
//         fontSize: 16,
//         marginBottom: 10,
//     },
//     featureText: {
//         fontSize: 14,
//         color: COLORS.black,
//         marginBottom: 5,
//     },
//     priceText: {
//         fontSize: 16,
//         color: COLORS.primary,
//         marginTop: 20,
//         fontWeight: 'bold',
//     },
//     flexDirection:{
//         flexDirection:'row',
//         justifyContent:'space-between'
//     }
// });

import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {baseURL} from '../../utils/constant/settings';
import CustomHeader from '../../components/CustomHeader';
import {COLORS} from '../../utils/Colors';
import strings from '../../helper/Language/LocalizedStrings';
import CustomButton from '../../components/CustomButton';
import WebView from 'react-native-webview';
import { endEvent } from 'react-native/Libraries/Performance/Systrace';

const ViewPriceProduct = ({route, navigation}) => {
  const {item, currency} = route.params;

  console.log('Currency on ViewPriceProduct screen:', currency);
  const user = useSelector(state => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkout_url, setCheckOutUrl] = useState('');
  const [isLoding, setIsLoading] = useState(false);

  const getApiHeaders = token => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Client-Type': 'mobile',
  });
  const price = currency === 'EUR'
      ? item.prices.find(p => p.currency === 'EUR')?.amount || 'N/A'
      : item.prices.find(p => p.currency === 'TRY')?.amount || 'N/A';
      console.log('first',price)


const handleConversion= async(price)=>{
    try {
        const res=await axios.get(`https://v6.exchangerate-api.com/v6/ca85d4c606285f25bc375250/pair/EUR/TRY/${price}`)
        return res;
        // console.log(res)
    } catch (error) {
        console.log(error)
    }
}


  // API Call to get Iyzico token
  const handleIzeco = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${baseURL}/payment/iyzico/token`,
        {
          'X-Client-Type': 'mobile',
          product_id: item?.id,
        // currency : currency=='EUR'?handleConversion()
        //   currency: 'EUR',
        currency: 'TRY',
        },
        {headers: getApiHeaders(user?.access_token)},
      );
      const checkoutUrl = response.data.checkout_url;
      setCheckOutUrl(checkoutUrl);
      setIsLoading(false);
      console.log('Checkout URL:', checkoutUrl);
    } catch (error) {
      console.error('Error-->>:', error.response?.data || error.message);
    }
  };

  // Calculate space in GB (if available)
  const availableSpaceGB = (item?.available_space / 1024 ** 3).toFixed(2); // Convert to GB

  // Find the price for the selected currency

  console.log('first', price);
  const HandleSubmit = () => {
    handleIzeco();
    setModalVisible(true);
  };

  {
    isLoding && <ActivityIndicator size="large" color={COLORS.blue} />;
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.backgroundColor}}>
      <View style={styles.container}>
        <CustomHeader
          back={true}
          OnPress={() => navigation.goBack()}
          title={strings.PRICE_LIST}
          left={true}
        />
        <View style={{...styles.card}}>
          <Text style={styles.productName}>Summary</Text>
          <Text style={styles.productName}>{item?.name}</Text>
          <Text style={styles.spaceText}>
            Available Space: {availableSpaceGB} GB
          </Text>

          {item?.feature_list?.map((feature, index) => (
            <Text key={index} style={styles.featureText}>
              • {feature}
            </Text>
          ))}

          <Text style={styles.priceText}>
            {item.prices.length > 0 ? (
              <Text style={styles.price}>
                {currency === 'TRY'
                  ? ` € ${
                      item.prices.find(p => p.currency === 'EUR')?.amount ||
                      'N/A'
                    } /Year `
                  : `₺ ${
                      item.prices.find(p => p.currency === 'TRY')?.amount ||
                      'N/A'
                    } /Year`}
              </Text>
            ) : (
              <Text style={{color: COLORS.black}}>No Pricing Data</Text>
            )}
          </Text>
        </View>

        <View style={{...styles.flexDirection}}>
          <Text style={{...styles.productName}}>Total Pay:</Text>
          {item.prices.length > 0 ? (
            <Text style={{...styles.productName}}>
              {currency === 'TRY'
                ? ` € ${
                    item.prices.find(p => p.currency === 'EUR')?.amount || 'N/A'
                  } `
                : `₺ ${
                    item.prices.find(p => p.currency === 'TRY')?.amount || 'N/A'
                  } `}
            </Text>
          ) : (
            <Text style={{color: COLORS.black}}>No Pricing Data</Text>
          )}
        </View>

        <View style={{marginTop: 20}}>
          <CustomButton buttonTitle={'Pay'} onPress={HandleSubmit} />
        </View>
      </View>

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Confirmation</Text>
            {isLoding ? (
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [{translateX: -25}, {translateY: -25}],
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <WebView
                source={{uri: checkout_url}}
                style={styles.webview}
                startInLoadingState={true}
              />
            )}

            <View style={styles.buttonContainer}>
              <CustomButton
                buttonTitle={'Cancel'}
                onPress={() => setModalVisible(false)}
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ViewPriceProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.backgroundColor,
  },
  card: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: COLORS.blue,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:COLORS.black
  },
  spaceText: {
    fontSize: 16,
    marginBottom: 10,
    color:COLORS.black
  },
  featureText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color:COLORS.black,
    marginTop: 20,
    fontWeight: 'bold',
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '90%',
    width: '100%',
    backgroundColor: COLORS.white,
    // borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  button: {
    marginVertical: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    alignSelf: 'center',
    color:COLORS.black
  },
});
