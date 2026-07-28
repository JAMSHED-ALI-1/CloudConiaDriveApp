import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {baseURL} from '../../utils/constant/settings';
import { getCsrfToken } from '../../utils/getCsrfToken';

const Homescreen = () => {
  const user = useSelector(state => state.auth.user);

  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!user?.access_token) return;
  

  const fetchHandleHomeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        pageId: '0',
        folderId: '0',
        workspaceId: '0',
        orderBy: 'updated_at',
        orderDir: 'desc',
        page: '1',
      }).toString();


      const response = await fetch(
        `${baseURL}/drive/file-entries?${query}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${user.access_token}`,
          },
        },
      );

      const text = await response.text();
      console.log('RAW RESPONSE:', text);

      if (!response.ok) {
        setError(text);
        return;
      }

      const data = JSON.parse(text);
      setHomeData(data?.data || []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  fetchHandleHomeData();
}, [user?.access_token]);



  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name || 'No Name'}</Text>
      <Text style={styles.subtitle}>
        {item.updated_at ? new Date(item.updated_at).toLocaleString() : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {homeData.length === 0 ? (
        <Text style={styles.center}>No recent files found.</Text>
      ) : (
        <FlatList
          data={homeData}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
