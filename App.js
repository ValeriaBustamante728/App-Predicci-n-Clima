import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapViewComponent from './components/MapView';

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

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [currentView, setCurrentView] = useState('map'); // 'map' o 'list'

  const handleCreateAlert = (alertData) => {
    setAlerts(prevAlerts => [...prevAlerts, alertData]);
  };

  const handleRemoveAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>☁️</Text>
        <Text style={styles.title}>Alerta Temprana</Text>
        <Text style={styles.subtitle}>Visualice alertas en tiempo real en micro-zonas</Text>
        
        {/* Botones de navegación */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentView === 'map' && styles.activeNavButton]}
            onPress={() => setCurrentView('map')}
          >
            <Text style={[styles.navButtonText, currentView === 'map' && styles.activeNavButtonText]}>
              🗺️ Mapa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentView === 'list' && styles.activeNavButton]}
            onPress={() => setCurrentView('list')}
          >
            <Text style={[styles.navButtonText, currentView === 'list' && styles.activeNavButtonText]}>
              📋 Alertas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
      {currentView === 'map' ? (
        <MapViewComponent
          onAlertCreated={handleCreateAlert}
          alerts={alerts}
          onRemoveAlert={handleRemoveAlert}
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Active Alerts */}
          <View style={styles.alertsContainer}>
            <Text style={styles.sectionTitle}>Alertas Activas ({alerts.length})</Text>
            
            {alerts.length === 0 ? (
              <View style={styles.noAlerts}>
                <Text style={styles.noAlertsText}>No hay alertas activas</Text>
                <Text style={styles.noAlertsSubtext}>Ve al mapa para crear nuevas alertas</Text>
              </View>
            ) : (
              alerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <Text style={styles.alertTitle}>Alerta: {alert.title}</Text>
                  <Text style={styles.alertDescription}>{alert.description}</Text>
                  <Text style={styles.alertTime}>Hora: {alert.timestamp}</Text>
                  {alert.latitude && alert.longitude && (
                    <Text style={styles.alertLocation}>
                      Ubicación: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.resolveButton}
                    onPress={() => handleRemoveAlert(alert.id)}
                  >
                    <Text style={styles.resolveButtonText}>Resolver</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
    justifyContent: 'space-between',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 2,
  },
  activeNavButton: {
    backgroundColor: 'white',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeNavButtonText: {
    color: '#3b82f6',
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  alertsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  noAlerts: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAlertsText: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 8,
  },
  noAlertsSubtext: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#dc2626',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#dc2626',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 10,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    marginBottom: 5,
  },
  alertLocation: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  resolveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resolveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});