import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AlertMarker = ({ alert, onPress }) => {
  return (
    <View style={styles.alertMarker}>
      <MaterialIcons name="warning" size={30} color="#ef4444" />
    </View>
  );
};

const styles = {
  alertMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default AlertMarker;
