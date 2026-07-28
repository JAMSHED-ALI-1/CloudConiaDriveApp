import {
  ActivityIndicator,
  Alert,
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
import {endEvent} from 'react-native/Libraries/Performance/Systrace';
import showMessageHandler from '../../utils/constant/ShowMessageHandler';

const ViewPriceProduct = ({route, navigation}) => {
  const {item, currency} = route.params;
const currentTheme = useSelector(state => state.theme.theme);
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
  const price =
    currency === 'EUR'
      ? item.prices.find(p => p.currency === 'EUR')?.amount || 0
      : item.prices.find(p => p.currency === 'TRY')?.amount || 0;
  console.log('first', price);

  useEffect(() => {
    // Cleanup when unmounting
    return () => setModalVisible(false);
  }, []);

  const handleWebViewNavigation = navState => {
    console.log('Navigating to:', navState.url);

    // If URL contains "callback" or any success keyword, process payment
    if (
      navState.url.includes('payment-callback') ||
      navState.url.includes('status=success')
    ) {
      console.log('Callback detected:', navState.url);

      // Extract token from URL
      const url = new URL(navState.url);
      const status = url.searchParams.get('status');
      const token = url.searchParams.get('token');

      console.log('Status:', status, 'Token:', token);

      setModalVisible(false);

      if (status === 'success') {
        verifyPayment(token);
      } else {
        Alert.alert('Payment Failed', 'Payment was not successful.');
      }
    }
  };

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
    if (price == 0) {
      showMessageHandler(
        'Payment is 0',
        'The price cannot be 0. Please check the pricing details.',
        [
          // { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
      );
      return;
    }

    handleIzeco();
    setModalVisible(true);
  };

  {
    isLoding && <ActivityIndicator size="large" color={COLORS.blue} />;
  }
  return (
    <SafeAreaView style={{flex: 1,backgroundColor: currentTheme==='dark'?COLORS.black:COLORS.backgroundColor}}>
      <View style={{...styles.container,backgroundColor:currentTheme==='dark'?COLORS.black:COLORS.backgroundColor}}>
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
              ✅   {feature}
            </Text>
          ))}

          <Text style={styles.priceText}>
            {item.prices.length >= 0 ? (
              <Text style={styles.price}>
                {currency === 'TRY'
                  ? ` € ${
                      item.prices.find(p => p.currency === 'EUR')?.amount || 0
                    } /Year `
                  : `₺ ${
                      item.prices.find(p => p.currency === 'TRY')?.amount || 0
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
                    item.prices.find(p => p.currency === 'EUR')?.amount || 0
                  } `
                : `₺ ${
                    item.prices.find(p => p.currency === 'TRY')?.amount || 0
                  } `}
            </Text>
          ) : (
            <Text
              style={{color: COLORS.black, fontSize: 18, fontWeight: '800'}}>
              0
            </Text>
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
              // <WebView
              //   source={{uri: checkout_url}}
              //   style={styles.webview}
              //   startInLoadingState={true}
              //   javaScriptEnabled={true}
              //   domStorageEnabled={true}
              //   onNavigationStateChange={handleWebViewNavigation}
              // />

              // Add these modifications to your WebView component
              // Modify your WebView component
<WebView
  source={{uri: checkout_url}}
  onNavigationStateChange={(navState) => {
    console.log('[PAYMENT] Current URL:', navState.url);

    // 1. Detect successful 3D Secure authentication
    if (navState.url.includes('iyzipos/checkoutform/callback3ds/success')) {
      console.log('[PAYMENT] 3DS Success - Closing WebView');
      
      // Extract token from URL
      const token = new URL(navState.url).searchParams.get('token');
      console.log(token,'new Token')
      
      // Immediately close WebView
      setModalVisible(false);
      
      // Verify payment with backend
      verifyPayment(token);
      
      return false; // Block further loading
    }

    // 2. Block redirects to login/dashboard
    if (navState.url.includes('coniacloud.com/login') || 
        navState.url.includes('coniacloud.com/')) {
      console.log('[PAYMENT] Blocking post-success redirect');
      setModalVisible(false);
      return false;
    }

    return true;
  }}
  onShouldStartLoadWithRequest={(request) => {
    // Block navigation to non-payment URLs
    if (!request.url.includes('iyzipay') && 
        !request.url.includes('payment-callback')) {
      console.log('[SECURITY] Blocked navigation to:', request.url);
      return false;
    }
    return true;
  }}
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
    color: COLORS.black,
  },
  spaceText: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.black,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 20,
    fontWeight: 'bold',
  },
  flexDirection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
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
    color: COLORS.black,
  },
});
