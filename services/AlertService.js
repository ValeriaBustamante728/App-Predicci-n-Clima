export const getAlertDescription = (alertType) => {
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

export const createAlert = (alertType, coordinate) => {
  const description = getAlertDescription(alertType);
  
  return {
    id: Date.now(),
    title: alertType,
    description,
    coordinate,
    timestamp: new Date().toLocaleTimeString(),
  };
};
