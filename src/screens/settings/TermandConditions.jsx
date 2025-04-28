import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';

const ReturnPolicyScreen = ({navigation}) => {
  return (
    <View style={{...styles.container}}>
    <CustomHeader title={'Return Policy'} back={true} left={true} OnPress={()=>navigation.goBack()}/>
    <ScrollView style={{flex:1}}>
      <Text style={styles.title}>Return Policy</Text>
      <Text style={styles.sectionTitle}>Delivery, Return, and Termination Policies for ConiaSoft and ConiaCloud Software Programs</Text>

    
      <Text style={styles.text}>
        At ConiaSoft, our commitment is to provide software solutions that enhance efficiency and productivity...
        We have established comprehensive return, refund, and termination policies aligned with the digital delivery of our offerings.
      </Text>

      <Text style={styles.text}>

      When purchasing ConiaSoft and ConiaCloud software programs, we want you to make the decision that best suits your needs. Please note that these products are digitally downloadable. Once the software has been accessed and downloaded, a physical return is not possible. However, we offer refunds under the conditions outlined below.

      </Text>
      <Text style={styles.text}>


      Our primary goal is to provide the information necessary to enable informed purchasing decisions. We recommend carefully reviewing the product details, features, and specifications available on our website before completing your purchase. If you have any questions or concerns about our software programs, please reach out to our dedicated support team at support@ConiaSoft.com. We are here to provide the necessary support to help you make an informed choice


</Text>

<Text style={styles.text}>We understand that issues or questions may arise even after a purchase is made. If you encounter technical difficulties during installation or use, our support team is always ready to assist. Our commitment to ensuring a positive experience with our products remains unwavering.</Text>
      <Text style={styles.sectionTitle}>Delivery Information</Text>
      <Text style={styles.text}>
      ConiaSoft and ConiaCloud software programs are designed to deliver effective solutions for both individuals and companies, with customer satisfaction at the core of our commitment. As part of our dedication to exceptional customer experiences, we have optimized the software delivery process.
      </Text>
      <Text style={styles.text}>
      Our digital distribution system ensures immediate access to the software’s features and capabilities. There’s no need to wait for physical shipments or navigate shipping delays. You can begin using the software as soon as your purchase is complete.
      </Text>
      <Text style={styles.text}>
      If you encounter any issues during the download or installation process, rest assured that our support team is ready to guide you. Feel free to contact us at support@ConiaSoft.com; our knowledgeable support staff will be happy to assist with any technical matters.

At ConiaSoft, our focus is on delivering innovative software solutions that meet diverse needs. We value the trust you place in our products and are committed to ensuring a seamless and productive experience with ConiaSoft and ConiaCloud software.

While our return policy is designed to meet your needs, please note that refunds are subject to specific conditions. We recommend carefully reviewing the terms outlined below.

      </Text>
      <Text style={styles.sectionTitle}>Return Policy</Text>
      <Text style={styles.subTitle}>15-Day Demo Account</Text>
      <Text style={styles.text}>
      When you connect with ConiaSoft, we offer you the opportunity to explore our software with a 15-day demo account. This means you can use our software at no cost for a limited time, experiencing its features and functionality firsthand. During this period, you can familiarize yourself with the software’s capabilities and assess how well it meets your needs.
      </Text>
     



      <Text style={styles.subTitle}>Transition to Paid Use</Text>
      <Text style={styles.text}>
      After the 15-day demo period ends and you’ve had the chance to thoroughly test our software, we offer a simple and transparent transition to the paid use phase. On the 16th day, we implement the software usage fees. These fees include a one-time license fee along with a choice between monthly or annual fees, depending on the package you select. This payment structure allows you to choose a plan that aligns with your preferences and requirements.
      </Text>

      <Text style={styles.subTitle}>Billing and Financial Details</Text>
      <Text style={styles.text}>
       
To ensure full transparency, we provide an invoice outlining the one-time license fee and the selected monthly or annual fees. This invoice serves as a reference for your records, ensuring you are well-informed about the financial aspects of your purchase.

      </Text>
      <Text style={styles.subTitle}>Refund Period and Conditions</Text>
      <Text style={styles.text}>
     
We offer a refund option within 15 days of transitioning to paid use. This means you have an additional 15 days to further evaluate the software in paid mode. If, for any reason, you decide during this time that the software does not meet your expectations or requirements, you may request a refund. The amount will be refunded, excluding bank transaction fees. We understand that technology needs can evolve, and we aim to provide flexibility in this regard.

      </Text>
      <Text style={styles.subTitle}>Refund Period Ends After the Initial 15-Day Paid Period:</Text>
      <Text style={styles.text}>
     
      However, it’s important to note that once this additional 15-day period ends, the refund option is no longer available. After the combined 30-day period (15-day demo + 15-day paid use), the refund window closes. This policy strikes a balance between giving customers ample time to evaluate the software and the practical limitations associated with software use.

Our approach is fundamentally designed to offer a comprehensive experience, from exploring the software’s potential during the demo period to making an informed decision when transitioning to paid use. The refund option within the subsequent 15-day paid period further enhances your peace of mind, allowing you to align your investment with your software needs. It’s important to make the most of these evaluation periods to ensure the software meets your expectations and contributes to your success.


      </Text>

      <Text style={styles.sectionTitle}>Termination Arrangements for ConiaSoft License Agreements</Text>
      <Text style={{...styles.text}}>
Our termination policies, outlined below, comply with Turkish law unless otherwise specified in the contract:
</Text>
      <Text style={styles.subTitle}>Right of Withdrawal</Text>
      <Text style={styles.text}>
      Customers have the right to withdraw within 30 calendar days from the start of the contract. ConiaSoft will refund payments made up until the withdrawal request, with no additional fees charged thereafter. The amount will be refunded, excluding bank transaction fees.

To process a withdrawal request, we kindly ask customers to settle any outstanding debts incurred during their relationship with us.

      </Text>

      <Text style={styles.subTitle}>Contract Termination</Text>
      <Text style={styles.text}>
        Ordinary Termination: Each software license agreement allows for mutual contract termination four weeks prior to the upcoming license fee payment.
      </Text>
      <Text style={styles.text}>
      Extraordinary Termination:Either party may extraordinarily terminate the contract at the end of each quarterly period with written notice. ConiaSoft will facilitate the transfer of customer data to a storage location designated by the customer, along with access rights to the existing database. This takes effect on the termination date
      </Text>
      <Text style={styles.text}>
      If payment is overdue, ConiaSoft will transfer the data after settling any outstanding claims. Upon confirmation of data receipt, ConiaSoft will permanently delete all project and customer data associated with the terminated contract.


As you embark on your journey with our software solutions, we are focused on supporting your growth goals. Our dedicated support team is always available to address any questions or concerns, ensuring a seamless experience with ConiaSoft and ConiaCloud.

We understand the importance of reliable software for your operations, which is why we ensure our solutions are designed to support your success. While physical returns are not possible due to the digital nature of our products, our commitment to exceptional service remains steadfast.

Thank you for choosing ConiaSoft. We look forward to contributing to your success and consistently exceeding your expectations. If you need further assistance or information, please don’t hesitate to contact us at support@ConiaSoft.com. Our team is fully equipped and ready to support you at every stage of your journey.

      </Text>

      <Text style={styles.sectionTitle}>Need Help?</Text>
      <Text style={styles.text}>
        For questions or assistance, please contact us at support@ConiaSoft.com. 
        Our team is ready to support you at every stage of your journey.
      </Text>
    </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#666',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default ReturnPolicyScreen;
