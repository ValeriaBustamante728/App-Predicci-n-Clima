# Alerta Temprana - Aplicación Móvil

Aplicación móvil React Native para visualizar alertas en tiempo real en micro-zonas. Esta aplicación es idéntica a la versión web, adaptada para dispositivos móviles.

## Características

- 🗺️ **Mapa interactivo** con diferentes estilos (Claro, Oscuro, Satélite)
- ⚠️ **Sistema de alertas** en tiempo real
- 📍 **Geolocalización** automática
- 🎨 **Interfaz idéntica** a la versión web
- 📱 **Optimizada para móviles** Android e iOS

## Tipos de Alertas Disponibles

- Frío y Seco
- Frío y Húmedo
- Templado y Seco
- Templado y Húmedo
- Cálido y Seco
- Cálido y Húmedo
- Muy Húmedo (Clima de Selva)
- Condiciones de Baja Presión (Posible Lluvia)
- Condiciones de Alta Presión (Cielo Despejado)
- Extremadamente Caliente

## Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (para Android)
- Xcode (para iOS, solo en macOS)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd "PDC Proyecto"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo**
   - **Android**: Presiona `a` en la terminal o escanea el código QR con la app Expo Go
   - **iOS**: Presiona `i` en la terminal o escanea el código QR con la app Expo Go
   - **Web**: Presiona `w` en la terminal

## Uso

1. **Permitir ubicación**: La aplicación solicitará permisos de ubicación para centrar el mapa en tu posición.

2. **Seleccionar tipo de alerta**: Usa el dropdown en el panel lateral para elegir el tipo de alerta.

3. **Colocar alerta**: Toca cualquier punto del mapa para colocar una alerta en esa ubicación.

4. **Ver alertas activas**: Las alertas aparecerán tanto en el mapa como en la lista del panel lateral.

5. **Resolver alertas**: Toca el botón "Resolver" en cualquier alerta para eliminarla.

6. **Cambiar estilo de mapa**: Usa los botones "Claro", "Oscuro" o "Satélite" en la esquina superior derecha.

7. **Centrar en ubicación**: Toca el botón de ubicación en la esquina inferior derecha.

## Estructura del Proyecto

```
PDC Proyecto/
├── App.js                 # Componente principal
├── package.json           # Dependencias del proyecto
├── app.json              # Configuración de Expo
├── babel.config.js       # Configuración de Babel
├── assets/               # Recursos (iconos, imágenes)
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── README.md             # Este archivo
```

## Tecnologías Utilizadas

- **React Native**: Framework para aplicaciones móviles
- **Expo**: Plataforma para desarrollo React Native
- **React Native Maps**: Componente de mapas
- **Expo Location**: Geolocalización
- **React Native Paper**: Componentes de UI
- **Material Icons**: Iconografía

## Configuración Adicional

### Para Android

1. Asegúrate de tener Android Studio instalado
2. Configura un emulador Android o conecta un dispositivo físico
3. Habilita "Opciones de desarrollador" y "Depuración USB" en tu dispositivo

### Para iOS

1. Asegúrate de tener Xcode instalado (solo en macOS)
2. Instala el simulador de iOS desde Xcode
3. O usa un dispositivo físico con la app Expo Go

## Solución de Problemas

### Error de permisos de ubicación
- Asegúrate de haber otorgado permisos de ubicación a la aplicación
- En Android: Ve a Configuración > Aplicaciones > Alerta Temprana > Permisos
- En iOS: Ve a Configuración > Privacidad > Servicios de ubicación

### Error de conexión
- Verifica que tu dispositivo esté conectado a internet
- Asegúrate de que el servidor de desarrollo esté ejecutándose

### Problemas con el mapa
- Verifica que tengas una conexión a internet estable
- Algunos estilos de mapa pueden requerir conexión a internet

## Desarrollo

Para modificar la aplicación:

1. Edita `App.js` para cambios en la funcionalidad principal
2. Modifica los estilos en el objeto `styles` dentro de `App.js`
3. Añade nuevas dependencias en `package.json`
4. Reinicia la aplicación con `npx expo start`

## Licencia

Este proyecto es de uso educativo y demostrativo.