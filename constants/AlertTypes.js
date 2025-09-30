export const ALERT_TYPES = [
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

export const MAP_TYPES = {
  standard: 'standard',
  satellite: 'satellite',
  hybrid: 'hybrid',
};

export const BOGOTA_COORDINATES = {
  latitude: 4.7110,
  longitude: -74.0721,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
