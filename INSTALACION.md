# Guía de Instalación - Alerta Temprana Mobile

## Requisitos Previos

### 1. Node.js y npm
- Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)
- Verifica la instalación:
  ```bash
  node --version
  npm --version
  ```

### 2. Expo CLI
Instala Expo CLI globalmente:
```bash
npm install -g @expo/cli
```

### 3. Para Android
- **Android Studio**: Descarga desde [developer.android.com](https://developer.android.com/studio)
- **Android SDK**: Instala a través de Android Studio
- **Emulador Android**: Crea un dispositivo virtual en Android Studio
- **Dispositivo físico**: Habilita "Opciones de desarrollador" y "Depuración USB"

### 4. Para iOS (solo en macOS)
- **Xcode**: Instala desde Mac App Store
- **Simulador iOS**: Instala a través de Xcode
- **Dispositivo físico**: Usa la app Expo Go

## Instalación del Proyecto

### 1. Navegar al directorio del proyecto
```bash
cd "PDC Proyecto"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar la aplicación
```bash
npx expo start
```

## Ejecución en Dispositivos

### Android
1. **Con emulador**:
   - Abre Android Studio
   - Inicia un emulador Android
   - En la terminal, presiona `a`

2. **Con dispositivo físico**:
   - Instala la app "Expo Go" desde Google Play Store
   - Escanea el código QR que aparece en la terminal
   - O presiona `a` en la terminal

### iOS
1. **Con simulador**:
   - Abre Xcode
   - Inicia el simulador iOS
   - En la terminal, presiona `i`

2. **Con dispositivo físico**:
   - Instala la app "Expo Go" desde App Store
   - Escanea el código QR que aparece en la terminal
   - O presiona `i` en la terminal

### Web
- En la terminal, presiona `w`
- Se abrirá en tu navegador predeterminado

## Solución de Problemas Comunes

### Error: "Metro bundler not found"
```bash
npx expo install --fix
```

### Error: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error de permisos en Android
1. Ve a Configuración > Aplicaciones > Expo Go > Permisos
2. Habilita "Ubicación"

### Error de permisos en iOS
1. Ve a Configuración > Privacidad > Servicios de ubicación
2. Habilita para Expo Go

### El mapa no se muestra
- Verifica tu conexión a internet
- Algunos estilos de mapa requieren conexión

### Error de geolocalización
- Asegúrate de haber otorgado permisos de ubicación
- Verifica que el GPS esté habilitado

## Comandos Útiles

### Desarrollo
```bash
# Iniciar en modo desarrollo
npx expo start

# Limpiar caché
npx expo start --clear

# Iniciar en modo tunnel (para dispositivos en diferentes redes)
npx expo start --tunnel
```

### Build
```bash
# Build para Android
npx expo build:android

# Build para iOS
npx expo build:ios
```

### Debugging
```bash
# Ver logs
npx expo logs

# Abrir herramientas de desarrollo
npx expo start --dev-client
```

## Estructura del Proyecto

```
PDC Proyecto/
├── App.js                    # Componente principal
├── package.json              # Dependencias
├── app.json                  # Configuración Expo
├── babel.config.js           # Configuración Babel
├── metro.config.js           # Configuración Metro
├── components/               # Componentes reutilizables
│   ├── Picker.js
│   ├── MapControls.js
│   ├── LocationButton.js
│   └── AlertMarker.js
├── constants/                # Constantes
│   └── AlertTypes.js
├── services/                 # Servicios
│   └── AlertService.js
├── assets/                   # Recursos
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── README.md
```

## Configuración Adicional

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```
EXPO_PUBLIC_API_URL=tu_api_url_aqui
EXPO_PUBLIC_API_KEY=tu_api_key_aqui
```

### Configuración de Mapas
Para usar Google Maps, necesitarás una API key:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita la API de Maps
4. Crea una API key
5. Añade la key en `app.json`

## Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de tener la versión correcta de Node.js
4. Revisa la documentación de Expo: [docs.expo.dev](https://docs.expo.dev/)
