import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LocationButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.locationButton} onPress={onPress}>
      <MaterialIcons name="my-location" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = {
  locationButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    zIndex: 1000,
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default LocationButton;
