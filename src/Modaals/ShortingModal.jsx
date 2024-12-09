import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const ShortingModal = ({ isVisible, onClose, onApply ,sotinginfo ,sortingOptions}) => {
  const [selectedDirection, setSelectedDirection] = useState('asc');
  const [selectedSortBy, setSelectedSortBy] = useState('created_at');
console.log('insied',sotinginfo)
  // Directions array with key and value
  const directions = [
    { key: 'Ascending', value: 'asc' },
    { key: 'Descending', value: 'desc' },
  ];

  // Sort by options with key and value

  const handleApply = () => {
    onApply({
      sortBy: selectedSortBy,
      sortDir: selectedDirection
    });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalBackground} onPress={onClose} activeOpacity={1}>
        <View style={styles.dropdownContainer}>
          {/* Direction Section */}
          <Text style={styles.sectionHeader}>DIRECTION</Text>
          {directions.map((direction) => (
            <TouchableOpacity
              key={direction.value}
              style={styles.option}
              onPress={() => setSelectedDirection(direction.value)}
            >
              <Text style={[
                styles.optionText, 
                selectedDirection === direction.value && styles.selectedText
              ]}>
                {selectedDirection === direction.value ? '✔ ' : ''}{direction.key}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Sort By Section */}
          <Text style={styles.sectionHeader}>SORT BY</Text>
          {sortingOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => setSelectedSortBy(option.value)}
            >
              <Text style={[
                styles.optionText, 
                selectedSortBy === option.value && styles.selectedText
              ]}>
                {selectedSortBy === option.value ? '✔ ' : ''}{option.key}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 300,
    padding: 15,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  applyButton: {
    marginTop: 15,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ShortingModal;
