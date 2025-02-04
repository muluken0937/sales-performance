import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../hooks/axiosInstance';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Description = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { customerId } = route.params;
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeGroups, setTimeGroups] = useState({});
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded state of each card

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/customers/${customerId}`);
        if (response.data.success) {
          const details = response.data.data;
          setCustomerDetails(details);

          // Combine the first description (if exists) with the descriptions array
          const allDescriptions = [];
          if (details.description) {
            allDescriptions.push({
              text: details.description,
              createdAt: details.createdAt, // Use the customer's createdAt for the first description
            });
          }
          if (details.descriptions && details.descriptions.length > 0) {
            allDescriptions.push(...details.descriptions);
          }

          // Sort descriptions by createdAt in descending order (latest first)
          allDescriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Group all descriptions by time
          const groups = groupDescriptionsByTime(allDescriptions);
          setTimeGroups(groups);
        } else {
          throw new Error(response.data.message || 'Failed to fetch customer details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  // Group descriptions by time
const groupDescriptionsByTime = (descriptions) => {
  const now = new Date();
  const groups = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };

  descriptions.forEach((desc) => {
    const descDate = new Date(desc.createdAt);
    // Normalize both dates to midnight for comparison
    const normalizedNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const normalizedDescDate = new Date(descDate.getFullYear(), descDate.getMonth(), descDate.getDate());

    if (normalizedDescDate.getTime() === normalizedNow.getTime()) {
      groups.today.push(desc);
    } else if (normalizedDescDate.getTime() === normalizedNow.getTime() - 86400000) { // 86400000 ms in a day
      groups.yesterday.push(desc);
    } else if (normalizedDescDate >= new Date(normalizedNow.getTime() - 7 * 86400000)) {
      groups.lastWeek.push(desc);
    } else {
      groups.older.push(desc);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};
  // Toggle expanded state for a card
  const toggleExpand = (groupName, index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [`${groupName}-${index}`]: !prev[`${groupName}-${index}`],
    }));
  };

  const getTimeCardStyle = () => {
    // Use a single style for all cards
    return styles.defaultCard;
  };

  const getGroupTitle = (groupName) => {
    switch (groupName) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'lastWeek':
        return 'Last Week';
      default:
        return 'Older';
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Icon name="close" size={24} color="#007BFF" />
      </TouchableOpacity>

      <Text style={styles.title}>{customerDetails.name}</Text>

      <ScrollView>
        {Object.keys(timeGroups).length > 0 ? (
          Object.keys(timeGroups).map((groupName) => (
            <View key={groupName} style={styles.section}>
              <Text style={styles.sectionTitle}>{getGroupTitle(groupName)}</Text>
              {timeGroups[groupName].map((desc, index) => {
                const isExpanded = expandedCards[`${groupName}-${index}`];
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeCard, getTimeCardStyle()]} // Use the same style for all cards
                    onPress={() => toggleExpand(groupName, index)}
                  >
                    <Text
                      style={styles.description}
                      numberOfLines={isExpanded ? undefined : 3} // Limit to 3 lines if not expanded
                    >
                      {desc.text}
                    </Text>
                    <Text style={styles.timeStamp}>
                      {new Date(desc.createdAt).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No descriptions available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc', // White background for the screen
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50', // Dark blue-gray for the title
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e', // Slightly lighter blue-gray for section titles
    marginBottom: 10,
  },
  timeCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultCard: {
    backgroundColor: '#f0f9ff', // Light gray background for cards
    borderLeftWidth: 4,
    borderLeftColor: '#3498db', // Blue border for cards
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50', // Dark blue-gray for description text
    marginBottom: 10,
  },
  timeStamp: {
    fontSize: 12,
    color: '#7f8c8d', // Gray for timestamp text
    fontStyle: 'italic',
  },
  errorText: {
    color: '#e74c3c', // Red for error messages
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d', // Gray for empty state text
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Description;