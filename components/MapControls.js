import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const MapControls = ({ mapType, onMapTypeChange }) => {
  const MAP_TYPES = {
    standard: 'standard',
    satellite: 'satellite',
    hybrid: 'hybrid',
  };

  const mapTypeButtons = [
    { key: MAP_TYPES.standard, label: 'Claro' },
    { key: MAP_TYPES.hybrid, label: 'Oscuro' },
    { key: MAP_TYPES.satellite, label: 'Satélite' },
  ];

  return (
    <View style={styles.mapControls}>
      <View style={styles.mapTypeButtons}>
        {mapTypeButtons.map((button) => (
          <TouchableOpacity
            key={button.key}
            style={[
              styles.mapTypeButton,
              mapType === button.key && styles.activeMapTypeButton
            ]}
            onPress={() => onMapTypeChange(button.key)}
          >
            <Text style={[
              styles.mapTypeButtonText,
              mapType === button.key && styles.activeMapTypeButtonText
            ]}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = {
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mapTypeButtons: {
    flexDirection: 'row',
  },
  mapTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  activeMapTypeButton: {
    backgroundColor: '#3b82f6',
  },
  mapTypeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  activeMapTypeButtonText: {
    color: 'white',
  },
};

export default MapControls;
