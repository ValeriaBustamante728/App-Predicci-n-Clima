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

const { width, height } = Dimensions.get('window');

const ALERT_TYPES = [
  { label: '-- Elige una alerta --', value: '' },
  { label: 'Frío y Seco', value: 'Frío y Seco' },
  { label: 'Frío y Húmedo', value: 'Frío y Húmedo' },
  { label: 'Templado y Seco', value: 'Templado y Seco' },
  { label: 'Templado y Húmedo', value: 'Templado y Húmedo' },
  { label: 'Cálido y Seco', value: 'Cálido y Seco' },
  { label: 'Cálido y Húmedo', value: 'Cálido y Húmedo' },
  { label: 'Muy Húmedo (Clima de Selva)', value: 'Muy Húmedo' },
  { label: 'Condiciones de Baja Presión (Posible Lluvia)', value: 'Baja Presión' },
  { label: 'Condiciones de Alta Presión (Cielo Despejado)', value: 'Alta Presión' },
  { label: 'Extremadamente Caliente', value: 'Extremadamente Caliente' },
];

export default function App() {
  const [selectedAlertType, setSelectedAlertType] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAlertDescription = (alertType) => {
    const descriptions = {
      'Frío y Seco': 'Se ha detectado una emergencia de Frío y Seco en la zona. Las temperaturas han descendido significativamente con baja humedad. Tome las precauciones necesarias.',
      'Frío y Húmedo': 'Se ha detectado una emergencia de Frío y Húmedo en la zona. Las condiciones climáticas presentan bajas temperaturas con alta humedad. Tome las precauciones necesarias.',
      'Templado y Seco': 'Se ha detectado una emergencia de Templado y Seco en la zona. Las condiciones climáticas son moderadas con baja humedad. Tome las precauciones necesarias.',
      'Templado y Húmedo': 'Se ha detectado una emergencia de Templado y Húmedo en la zona. Las condiciones climáticas son moderadas con alta humedad. Tome las precauciones necesarias.',
      'Cálido y Seco': 'Se ha detectado una emergencia de Cálido y Seco en la zona. Las temperaturas son elevadas con baja humedad. Tome las precauciones necesarias.',
      'Cálido y Húmedo': 'Se ha detectado una emergencia de Cálido y Húmedo en la zona. Las condiciones climáticas presentan altas temperaturas con alta humedad. Tome las precauciones necesarias.',
      'Muy Húmedo': 'Se ha detectado una emergencia de Muy Húmedo (Clima de Selva) en la zona. La humedad es extremadamente alta. Tome las precauciones necesarias.',
      'Baja Presión': 'Se ha detectado una emergencia de Condiciones de Baja Presión (Posible Lluvia) en la zona. Hay probabilidad de precipitaciones. Tome las precauciones necesarias.',
      'Alta Presión': 'Se ha detectado una emergencia de Condiciones de Alta Presión (Cielo Despejado) en la zona. Las condiciones son estables. Tome las precauciones necesarias.',
      'Extremadamente Caliente': 'Se ha detectado una emergencia de Extremadamente Caliente en la zona. Las temperaturas son peligrosamente altas. Tome las precauciones necesarias.',
    };
    
    return descriptions[alertType] || `Se ha detectado una emergencia de ${alertType} en la zona. Tome las precauciones necesarias.`;
  };

  const createAlert = () => {
    if (!selectedAlertType) {
      Alert.alert('Selecciona una alerta', 'Por favor, selecciona un tipo de alerta primero.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const description = getAlertDescription(selectedAlertType);
      
      const newAlert = {
        id: Date.now(),
        title: selectedAlertType,
        description,
        timestamp: new Date().toLocaleTimeString(),
      };

      setAlerts(prev => [...prev, newAlert]);
      Alert.alert('¡Alerta creada!', 'La alerta se ha creado exitosamente.');
      setIsLoading(false);
    }, 1000);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>☁️</Text>
          <Text style={styles.logoIcon2}>⚡</Text>
        </View>
        <Text style={styles.title}>Alerta Temprana</Text>
        <Text style={styles.subtitle}>Visualice alertas en tiempo real en micro-zonas.</Text>
      </View>

      {/* Alert Selection */}
      <View style={styles.alertSelection}>
        <Text style={styles.alertLabel}>Selecciona el tipo de alerta:</Text>
        <ScrollView style={styles.pickerContainer}>
          {ALERT_TYPES.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.pickerOption,
                selectedAlertType === type.value && styles.selectedOption
              ]}
              onPress={() => setSelectedAlertType(type.value)}
            >
              <Text style={[
                styles.pickerText,
                selectedAlertType === type.value && styles.selectedText
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.instructionText}>
          {isLoading ? 'Generando alerta...' : 'Toca "Crear Alerta" para simular una alerta.'}
        </Text>
        <TouchableOpacity style={styles.createButton} onPress={createAlert}>
          <Text style={styles.createButtonText}>Crear Alerta</Text>
        </TouchableOpacity>
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
                  <Text style={styles.alertTime}>Hora: {alert.timestamp}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 60,
    color: '#6b7280',
  },
  logoIcon2: {
    position: 'absolute',
    top: 15,
    left: 15,
    fontSize: 30,
    color: '#f59e0b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  alertSelection: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  alertLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  pickerContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 16,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedOption: {
    backgroundColor: '#3b82f6',
  },
  pickerText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  instructionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 14,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  noAlertsText: {
    fontSize: 16,
    color: '#6b7280',
  },
  alertCard: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
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
});
