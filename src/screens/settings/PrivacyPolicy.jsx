import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/Colors';  // Assuming you have a COLORS file
import CustomHeader from '../../components/CustomHeader';  // Assuming you have a CustomHeader component
import { baseURL } from '../../utils/constant/settings';
import axios from 'axios';
import strings from '../../helper/Language/LocalizedStrings';
import { useSelector } from 'react-redux';
import WebView from 'react-native-webview';

const PrivacyPolicy = ({ navigation }) => {
  const currentTheme = useSelector((state) => state.theme.theme);
  const [loading, setLoading] = useState(true);
  const currentlanguage = useSelector((state) => state.language.language);
  console.log(currentlanguage, 'currentlanguage');
   const pdfUrl = currentlanguage==='tur'?'https://coniasoft.com/wp-content/uploads/2025/05/TR_pp.pdf':'https://coniasoft.com/wp-content/uploads/2025/05/GER_pp.pdf';
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;


  const renderLoading = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:currentTheme==='dark'?COLORS.black:COLORS.backgroundColor}}>

   
    <View style={styles.container}>
      <CustomHeader
        back={true}
        left={true}
        title={strings.PrivacyPolicy}
        OnPress={() => navigation.goBack()}
      />
      {currentlanguage==='eng'?<ScrollView contentContainerStyle={styles.content}>
        <Text style={{...styles.title,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>ConiaCloud PRIVACY POLICY</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>As CONIASOFT YAZILIM TEKNOLOJİLERİ LİMİTED ŞİRKETİ, we recognize that you trust us to store and manage your information, and we take this responsibility seriously by working diligently to ensure the highest level of security for your data.  
Through this Privacy Policy, we aim to help you understand what data we collect, why we collect it, and how you can update, manage, share, or delete your information.  
Please note that by using this site, you acknowledge that you have read and accepted the privacy and security terms and conditions.
</Text>

        {/* Personal Data We Collect */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>Personal Data We Collect</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          ConiaCloud collects data from you through our products. Some of this data is provided directly by you. Other data is collected based on your interactions, usage of our products, and experiences with them. The data we collect depends on the context of your interactions with ConiaCloud, the choices you make—including your privacy settings—and the products and features you use. Additionally, we may obtain data about you from third parties.
        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
        You have options regarding the technology you use and the data you share. When we ask you to provide personal data, you may decline. Many of our products require some personal data to provide you with services. If you choose not to provide the data necessary for us to deliver a product or feature, you will not be able to use that product or feature. Similarly, if we are required by law to collect personal data or need it to enter into a contract with you, and you do not provide it, we may not be able to enter into the contract or, if it relates to an existing product you use, we may suspend or cancel it. In cases where providing data is optional, if you choose not to share personal data, you will not be able to use features like personalization that rely on that data.  

        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          At ConiaCloud, we use the data we collect to provide you with rich, interactive experiences. Specifically, we use the data for the following purposes:
        </Text>
        <Text style={{...styles.bulletPoint,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>- To provide our products, including updating, securing, troubleshooting, and offering support.</Text>
        <Text style={{...styles.bulletPoint,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>- To improve and develop our products.</Text>
        <Text style={{...styles.bulletPoint,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>- To personalize our products and make recommendations.</Text>
        <Text style={{...styles.bulletPoint,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>- For advertising and marketing purposes, including promotional communications, targeted ads, and offers that may interest you.</Text>
        <Text style={{...styles.bulletPoint,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>- To analyze our performance, fulfill legal obligations, develop our workforce, and conduct research.</Text>

        {/* Information Sharing */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>Information Sharing</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          We do NOT share your information with third parties, we do NOT share your email addresses with sponsors or any third parties, and we do NOT send special “sponsored” emails on behalf of third parties.
        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          We do not use vulnerability scanning and/or scanning according to PCI standards. We use regular Malware Scanning. Your personal information is stored behind secure networks and is only accessible by a limited number of individuals who have special access rights to such systems and are required to keep the information confidential. Additionally, all sensitive/credit information you provide is encrypted using Secure Socket Layer (SSL) technology.
        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          We implement various security measures when a user enters, submits, or accesses their information to maintain the safety of your personal data. All transactions are processed through a gateway provider and are not stored or processed on our servers.
        </Text>


        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          However, no security procedure or protocol can be guaranteed to be 100% secure. Therefore, we recommend exercising caution when disclosing personal information online and using readily available tools such as internet firewalls, antivirus and anti-spyware software, and similar technologies to protect yourself online.
        </Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
        We only share data WHEN REQUIRED BY LAW or to respond to legal processes, protect our customers, safeguard lives, ensure the security of our products, and protect the rights and property of ConiaCloud and its customers, with affiliates and subsidiaries under ConiaCloud’s control.
        </Text>
        {/* Cookies */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>Cookies</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Cookies are small text files placed on your device to store data that can be retrieved by a web server in the domain that placed the cookie. We use cookies and similar technologies to store and learn about your preferences and settings. This allows you to log in, receive interest-based ads, combat fraud, analyze product performance, and fulfill other legitimate purposes.
        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          You have many tools to control the data collected by cookies, web beacons, and similar technologies. For example, you can use controls in your internet browser to limit how the websites you visit use cookies, and you can withdraw your consent by clearing or blocking cookies.
        </Text>

        {/* Credit Card Security */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>Credit Card Security</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Your credit card information is not stored in our system under any circumstances.
        </Text>

        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          During shopping, the credit card information used is encrypted and transmitted to the relevant bank independently of our site using the 128-bit SSL (Secure Sockets Layer) protocol.
        </Text>

        {/* Privacy Agreement */}
        <Text style={{...styles.title,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>ConiaCloud PRIVACY AGREEMENT</Text>
        
        {/* Parties to the Agreement */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>1. Parties to the Agreement</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          This privacy agreement (“Agreement”) has been concluded between the Customer and CONIASOFT YAZILIM TEKNOLOJİLERİ LİMİTED ŞİRKETİ.
        </Text>

        {/* Subject of the Agreement */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>2. Subject of the Agreement</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Due to the existing commercial relationship between the Parties, this Agreement will govern how personal and confidential information is handled.
        </Text>

        {/* Definition of Confidential Information */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>3. Definition of Confidential Information</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Any ideas, inventions, business methods, patents, trademarks, or any other information shared between the Parties shall be considered Confidential Information.
        </Text>

        {/* Obligations of the Parties */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>4. Obligations of the Parties</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          The Customer shall bear full responsibility for transactions conducted through authorized users, and the Service Provider shall not be responsible for any unauthorized use of their accounts.
        </Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          The Service Provider undertakes not to disclose Confidential Information shared between the Parties without prior written consent.
        </Text>

        {/* Permitted Disclosure */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>5. Permitted Disclosure</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          The Service Provider may disclose Confidential Information only if required by law or legal obligations, or with the Customer’s written consent.
        </Text>

        {/* Amendments */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>6. Amendments</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Any amendments or changes to this Agreement shall be valid only if made in writing and signed by both Parties.
        </Text>

        {/* Notifications */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>7. Notifications</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          All notifications under this Agreement shall be made via email, fax, or in person. The Parties shall notify each other in writing of any changes to their contact addresses.
        </Text>

        {/* Duration and Termination */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>8. Duration and Termination of the Agreement</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          The Agreement will remain in effect unless terminated by either Party. The confidentiality obligations shall continue indefinitely after the termination of the Agreement.
        </Text>

        {/* Miscellaneous */}
        <Text style={{...styles.sectionTitle,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>9. Miscellaneous</Text>
        <Text style={{...styles.text,color:currentTheme==='dark'?COLORS.white:COLORS.black}}>
          Any fees arising from the signing of this Agreement shall be borne by the Customer.
        </Text>
      </ScrollView>:
      <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <WebView
        source={{ uri: viewerUrl }}
        onLoadEnd={() => setLoading(false)}
        style={styles.webView}
      />
    </View>}
    </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.backgroundColor,
    padding:15
  },
  content: {
    // padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: COLORS.primary,
  },
  text: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
    color: COLORS.textColor,
  },
  bulletPoint: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 22,
    color: COLORS.textColor,
    paddingLeft: 20,
  },
    
  webView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});



// import React from 'react';
// import { ActivityIndicator, StyleSheet, View } from 'react-native';
// import { WebView } from 'react-native-webview';
// import CustomHeader from '../../components/CustomHeader';

// const PDFViewer = ({navigation}) => {
//   const pdfUrl = 'https://coniasoft.com/wp-content/uploads/2025/05/TR_rp.pdf';
//   const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

//   // Custom loading component
//   const renderLoading = () => (
//     <View style={styles.loaderContainer}>
//       <ActivityIndicator size="large" color="#007AFF" />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <CustomHeader title={'Privacy Policy'} back={true} left={true} OnPress={()=>navigation.goBack()}/>
//       <WebView
//         source={{ uri: viewerUrl }}
//         startInLoadingState={true}
//         renderLoading={renderLoading}
//         style={styles.webView}
//       />
//     </View>
//   );
// };

// export default PDFViewer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   webView: {
//     flex: 1,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
// });
