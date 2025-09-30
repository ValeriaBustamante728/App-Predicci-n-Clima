import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import CustomPicker from './components/Picker';
import MapControls from './components/MapControls';
import LocationButton from './components/LocationButton';
import AlertMarker from './components/AlertMarker';
import { ALERT_TYPES, MAP_TYPES, BOGOTA_COORDINATES } from './constants/AlertTypes';
import { createAlert } from './services/AlertService';

const { width, height } = Dimensions.get('window');


export default function App() {
  const [selectedAlertType, setSelectedAlertType] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [mapType, setMapType] = useState(MAP_TYPES.standard);
  const [region, setRegion] = useState(BOGOTA_COORDINATES);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesita permiso de ubicación para usar esta aplicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };


  const handleMapPress = async (event) => {
    if (!selectedAlertType) {
      Alert.alert('Selecciona una alerta', 'Por favor, selecciona un tipo de alerta primero.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const newAlert = createAlert(selectedAlertType, { latitude, longitude });

      setAlerts(prev => [...prev, newAlert]);
      
      // Centrar el mapa en la nueva alerta
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      Alert.alert('¡Alerta creada!', 'La alerta se ha creado exitosamente.');
    } catch (error) {
      console.error('Error creating alert:', error);
      Alert.alert('Error', 'Hubo un problema al crear la alerta.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      setRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      getLocationAsync();
    }
  };

  const renderMapControls = () => (
    <MapControls mapType={mapType} onMapTypeChange={setMapType} />
  );

  const renderLocationButton = () => (
    <LocationButton onPress={centerOnUserLocation} />
  );

  const renderAlertMarker = (alert) => (
    <Marker
      key={alert.id}
      coordinate={alert.coordinate}
      title={`Alerta de ${alert.title}`}
      description={alert.description}
    >
      <AlertMarker alert={alert} />
    </Marker>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="cloud" size={80} color="#6b7280" />
            <MaterialIcons name="flash-on" size={40} color="#f59e0b" style={styles.logoIcon} />
          </View>
          <Text style={styles.title}>Alerta Temprana</Text>
          <Text style={styles.subtitle}>Visualice alertas en tiempo real en micro-zonas.</Text>
        </View>

        {/* Alert Selection */}
        <View style={styles.alertSelection}>
          <Text style={styles.alertLabel}>Selecciona el tipo de alerta:</Text>
          <CustomPicker
            selectedValue={selectedAlertType}
            onValueChange={setSelectedAlertType}
            items={ALERT_TYPES}
            placeholder="-- Elige una alerta --"
          />
          <Text style={styles.instructionText}>
            {isLoading ? 'Generando alerta...' : 'Toca el mapa para colocar una alerta.'}
          </Text>
        </View>

        {/* Active Alerts */}
        <View style={styles.activeAlertsContainer}>
          <Text style={styles.activeAlertsTitle}>Alertas Activas</Text>
          <ScrollView style={styles.alertsList}>
            {alerts.length === 0 ? (
              <View style={styles.noAlertsContainer}>
                <Text style={styles.noAlertsText}>No hay alertas activas.</Text>
              </View>
            ) : (
              alerts.map(alert => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>Alerta: {alert.title}</Text>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.resolveButton}
                    onPress={() => removeAlert(alert.id)}
                  >
                    <Text style={styles.resolveButtonText}>Resolver</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={mapType}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {alerts.map(renderAlertMarker)}
        </MapView>
        
        {renderMapControls()}
        {renderLocationButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    width: 350,
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  logoIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  alertSelection: {
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 32,
  },
  alertLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  instructionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 14,
  },
  activeAlertsContainer: {
    flex: 1,
  },
  activeAlertsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  alertsList: {
    flex: 1,
  },
  noAlertsContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noAlertsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertCard: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertContent: {
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  resolveButton: {
    backgroundColor: '#b91c1c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  resolveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
});
