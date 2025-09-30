import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const ALERT_TYPES = [
  'Frío y Seco',
  'Frío y Húmedo', 
  'Templado y Seco',
  'Templado y Húmedo',
  'Cálido y Seco',
  'Cálido y Húmedo',
  'Muy Húmedo (Clima de Selva)',
  'Condiciones de Baja Presión (Posible Lluvia)',
  'Condiciones de Alta Presión (Cielo Despejado)',
  'Extremadamente Caliente'
];

const ALERT_DESCRIPTIONS = {
  'Frío y Seco': 'Se ha detectado una emergencia de Frío y Seco en la zona. Las temperaturas han descendido significativamente con baja humedad. Tome las precauciones necesarias.',
  'Frío y Húmedo': 'Se ha detectado una emergencia de Frío y Húmedo en la zona. Las condiciones climáticas presentan bajas temperaturas con alta humedad. Tome las precauciones necesarias.',
  'Templado y Seco': 'Se ha detectado una emergencia de Templado y Seco en la zona. Las condiciones climáticas son moderadas con baja humedad. Tome las precauciones necesarias.',
  'Templado y Húmedo': 'Se ha detectado una emergencia de Templado y Húmedo en la zona. Las condiciones climáticas son moderadas con alta humedad. Tome las precauciones necesarias.',
  'Cálido y Seco': 'Se ha detectado una emergencia de Cálido y Seco en la zona. Las temperaturas son elevadas con baja humedad. Tome las precauciones necesarias.',
  'Cálido y Húmedo': 'Se ha detectado una emergencia de Cálido y Húmedo en la zona. Las condiciones climáticas presentan altas temperaturas con alta humedad. Tome las precauciones necesarias.',
  'Muy Húmedo (Clima de Selva)': 'Se ha detectado una emergencia de Muy Húmedo (Clima de Selva) en la zona. La humedad es extremadamente alta. Tome las precauciones necesarias.',
  'Condiciones de Baja Presión (Posible Lluvia)': 'Se ha detectado una emergencia de Condiciones de Baja Presión (Posible Lluvia) en la zona. Hay probabilidad de precipitaciones. Tome las precauciones necesarias.',
  'Condiciones de Alta Presión (Cielo Despejado)': 'Se ha detectado una emergencia de Condiciones de Alta Presión (Cielo Despejado) en la zona. Las condiciones son estables. Tome las precauciones necesarias.',
  'Extremadamente Caliente': 'Se ha detectado una emergencia de Extremadamente Caliente en la zona. Las temperaturas son peligrosamente altas. Tome las precauciones necesarias.',
};

// Solo 3 tipos de mapa: light, dark, satellite

export default function MapViewComponent({ onAlertCreated, alerts, onRemoveAlert }) {
  const [selectedAlertType, setSelectedAlertType] = useState('');
  const [mapType, setMapType] = useState('light');
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de ubicación para usar esta función.');
        return;
      }
      getCurrentLocation();
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Enviar ubicación al WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'setLocation',
          latitude,
          longitude
        }));
      }
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
    }
  };

  const createAlert = async (latitude, longitude) => {
    setIsLoading(true);
    
    try {
      const description = ALERT_DESCRIPTIONS[selectedAlertType] || 
        `Se ha detectado una emergencia de ${selectedAlertType} en la zona. Tome las precauciones necesarias.`;

      const newAlert = {
        id: Date.now(),
        title: selectedAlertType,
        description: description,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date().toLocaleTimeString(),
      };

      onAlertCreated(newAlert);
      setSelectedAlertType('');

      Alert.alert('Éxito', '¡Alerta creada exitosamente!');
    } catch (error) {
      console.error('Error creating alert:', error);
      Alert.alert('Error', 'Hubo un problema al crear la alerta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapTypeChange = (type) => {
    console.log('Changing map type to:', type);
    setMapType(type);
    
    if (webViewRef.current) {
      setTimeout(() => {
        webViewRef.current.injectJavaScript(`
          console.log('Changing map type to: ${type}');
          if (window.map && window.changeMapLayer) {
            window.changeMapLayer('${type}');
          }
          true;
        `);
      }, 100);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapClick') {
        if (!selectedAlertType) {
          Alert.alert('Error', 'Por favor, selecciona un tipo de alerta primero.');
          return;
        }
        createAlert(data.latitude, data.longitude);
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  // Generar HTML para el mapa con Leaflet
  const generateMapHTML = () => {
    const alertsJSON = JSON.stringify(alerts);
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mapa de Alertas</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          #map { height: 100vh; width: 100vw; }
          .alert-marker { 
            background: #ef4444; 
            border: 2px solid #fff; 
            border-radius: 50%; 
            width: 20px; 
            height: 20px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          // Inicializar el mapa
          const map = L.map('map').setView([4.7110, -74.0721], 12);
          window.map = map;
          
          // Definir las capas de mapa (basado en script.js del proyecto web)
          const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd'
          });

          const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          });

          const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
          });

          // Establecer la capa inicial
          let currentLayer = lightLayer;
          currentLayer.addTo(map);

          // Función para cambiar capa del mapa (basada en script.js)
          function changeMapLayer(type) {
            console.log('Changing map layer to:', type);
            
            // Guardar marcadores de alertas antes de cambiar
            const alertMarkers = [];
            map.eachLayer(layer => {
              if (layer instanceof L.Marker && layer.options.icon && layer.options.icon.options.html && layer.options.icon.options.html.includes('⚠️')) {
                alertMarkers.push({
                  latlng: layer.getLatLng(),
                  popup: layer.getPopup() ? layer.getPopup().getContent() : null
                });
              }
            });
            
            // Remover capa actual
            if (currentLayer) {
              map.removeLayer(currentLayer);
            }
            
            // Agregar nueva capa
            switch(type) {
              case 'light':
                currentLayer = lightLayer;
                break;
              case 'dark':
                currentLayer = darkLayer;
                break;
              case 'satellite':
                currentLayer = satelliteLayer;
                break;
            }
            
            currentLayer.addTo(map);
            
            // Recrear marcadores de alertas
            alertMarkers.forEach(alertData => {
              const newMarker = L.marker(alertData.latlng, {
                icon: L.divIcon({
                  className: 'alert-marker',
                  html: '⚠️',
                  iconSize: [30, 30]
                })
              }).addTo(map);
              
              if (alertData.popup) {
                newMarker.bindPopup(alertData.popup);
              }
            });
            
            console.log('Map layer changed successfully to:', type);
          }
          
          // Hacer la función global
          window.changeMapLayer = changeMapLayer;

          // Intentar obtener la ubicación del usuario
          map.locate({setView: true, maxZoom: 16});

          function onLocationFound(e) {
            L.circle(e.latlng, {
              color: '#3b82f6',
              fillColor: '#60a5fa',
              fillOpacity: 0.5,
              radius: 500
            }).addTo(map).bindPopup("Estás aquí.").openPopup();
          }

          function onLocationError(e) {
            console.log('Location error:', e.message);
          }

          map.on('locationfound', onLocationFound);
          map.on('locationerror', onLocationError);
          
          // Agregar alertas existentes
          const alerts = ${alertsJSON};
          alerts.forEach(alert => {
            const marker = L.marker([alert.latitude, alert.longitude], {
              icon: L.divIcon({
                className: 'alert-marker',
                html: '⚠️',
                iconSize: [30, 30]
              })
            }).addTo(map);
            
            marker.bindPopup(\`
              <div style="font-family: Arial, sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: #ef4444;">Alerta: \${alert.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px;">\${alert.description}</p>
                <small style="color: #666;">Ubicación: \${alert.latitude.toFixed(4)}, \${alert.longitude.toFixed(4)}</small><br>
                <small style="color: #666;">Hora: \${alert.timestamp}</small>
              </div>
            \`);
          });
          
          // Manejar clics en el mapa
          map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapClick',
              latitude: lat,
              longitude: lng
            }));
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      {/* Controles del mapa */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={[styles.mapControlButton, mapType === 'light' && styles.activeButton]}
          onPress={() => handleMapTypeChange('light')}
        >
          <Text style={[styles.mapControlText, mapType === 'light' && styles.activeText]}>
            Claro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mapControlButton, mapType === 'dark' && styles.activeButton]}
          onPress={() => handleMapTypeChange('dark')}
        >
          <Text style={[styles.mapControlText, mapType === 'dark' && styles.activeText]}>
            Oscuro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mapControlButton, mapType === 'satellite' && styles.activeButton]}
          onPress={() => handleMapTypeChange('satellite')}
        >
          <Text style={[styles.mapControlText, mapType === 'satellite' && styles.activeText]}>
            Satélite
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón de ubicación */}
      <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
        <Text style={styles.locationButtonText}>📍</Text>
      </TouchableOpacity>

      {/* WebView con mapa */}
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: generateMapHTML() }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        injectedJavaScript={`
          window.changeMapType = function(type) {
            if (window.map) {
              console.log('Changing map type via injected JS:', type);
              changeMapType(type);
            }
          };
          true;
        `}
      />

      {/* Selector de tipo de alerta */}
      <View style={styles.alertSelector}>
        <Text style={styles.alertSelectorTitle}>Selecciona el tipo de alerta:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.alertScrollView}
          contentContainerStyle={styles.alertScrollContent}
        >
          {ALERT_TYPES.map((alertType, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.alertOption,
                selectedAlertType === alertType && styles.selectedAlertOption
              ]}
              onPress={() => setSelectedAlertType(alertType)}
            >
              <Text style={[
                styles.alertOptionText,
                selectedAlertType === alertType && styles.selectedAlertOptionText
              ]}>
                {alertType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={styles.statusMessage}>
          {selectedAlertType 
            ? `Alerta seleccionada: ${selectedAlertType}` 
            : 'Selecciona un tipo de alerta y toca el mapa para crear una alerta'
          }
        </Text>
      </View>

      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Creando alerta...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: height,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 200, // Ajustado para 3 botones
  },
  mapControlButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 65,
  },
  activeButton: {
    backgroundColor: '#3b82f6',
  },
  mapControlText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },
  activeText: {
    color: 'white',
  },
  locationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#3b82f6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 20,
  },
  alertSelector: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 200,
  },
  alertSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
      alertScrollView: {
        maxHeight: 60,
        marginBottom: 12,
      },
      alertScrollContent: {
        paddingHorizontal: 4,
        alignItems: 'center',
      },
      alertOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      },
      alertOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
        marginHorizontal: 4,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
      },
  selectedAlertOption: {
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
  },
  alertOptionText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedAlertOptionText: {
    color: 'white',
  },
  statusMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
