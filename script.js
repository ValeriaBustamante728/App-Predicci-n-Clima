document.addEventListener('DOMContentLoaded', () => {
    if (typeof L === 'undefined') {
        console.error('Error: Leaflet library not loaded.');
        return;
    }

    // Inicializar el mapa
    const map = L.map('map').setView([4.7110, -74.0721], 12); // Coordenadas de Bogotá, Colombia

    // ======================= INICIO DEL CÓDIGO AÑADIDO =======================

    // --- 1. Definición de las capas de mapa (Tiles) ---
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

    const satelliteNightLayer = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
        attribution: 'Imagery provided by services from NASA.',
        format: 'jpg',
        minZoom: 1,
        maxZoom: 8,
        tilematrixset: 'GoogleMapsCompatible_Level'
    });

    // --- 2. Establecer la capa inicial ---
    let currentLayer = lightLayer;
    currentLayer.addTo(map);

    // ======================= FIN DEL CÓDIGO AÑADIDO =======================

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
        console.log(e.message);
        // Podrías mostrar un mensaje al usuario aquí si quieres
        alert("No se pudo obtener tu ubicación. Asegúrate de haber dado permiso de geolocalización.");
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    
    const locateMeBtn = document.getElementById('locate-me-btn');

    if (locateMeBtn) {
        locateMeBtn.addEventListener('click', () => {
            // Cuando se hace clic en el botón, intentamos localizar al usuario de nuevo
            map.locate({setView: true, maxZoom: 16});
        });
    } else {
        console.error('Error: Botón de ubicación (locate-me-btn) no encontrado en el DOM.');
    }

    // Array para almacenar las alertas
    let alerts = [];
    let markerId = 0;
    const apiKey = ""; // TU API KEY DE GEMINI AQUÍ
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-1.5-pro-latest:generateContent?key=${apiKey}`;

    // Referencias a elementos del DOM
    const alertTypeSelect = document.getElementById('alertTypeSelect');
    const loadingSpinner = document.getElementById('loading-spinner');
    const activeAlertsList = document.getElementById('active-alerts');
    const noAlertsMessage = document.getElementById('no-alerts-message');
    const alertMessage = document.getElementById('alert-message');
    const errorMessage = document.getElementById('error-message');
    const statusMessage = document.getElementById('status-message');

    // ======================= INICIO DEL CÓDIGO AÑADIDO =======================

    // --- 3. Referencias a los botones de cambio de mapa ---
    const btnDefault = document.getElementById('btn-default');
    const btnDark = document.getElementById('btn-dark');
    const btnSatellite = document.getElementById('btn-satellite');
  

    // --- 4. Listeners para cambiar el estilo del mapa ---
    btnDefault.addEventListener('click', () => {
        if (currentLayer !== lightLayer) {
            map.removeLayer(currentLayer);
            currentLayer = lightLayer;
            currentLayer.addTo(map);
        }
    });

    btnDark.addEventListener('click', () => {
        if (currentLayer !== darkLayer) {
            map.removeLayer(currentLayer);
            currentLayer = darkLayer;
            currentLayer.addTo(map);
        }
    });

    btnSatellite.addEventListener('click', () => {
        if (currentLayer !== satelliteLayer) {
            map.removeLayer(currentLayer);
            currentLayer = satelliteLayer;
            currentLayer.addTo(map);
        }
    });

   

    // ======================= FIN DEL CÓDIGO AÑADIDO =======================


    // Función para mostrar un mensaje de alerta temporal
    const showTemporaryMessage = (element, duration = 3000) => {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, duration);
    };

    // (El resto de tu código de manejo de alertas permanece exactamente igual)
    // ...
    // ...
    const updateAlertsList = () => {
        activeAlertsList.innerHTML = '';
        if (alerts.length > 0) {
            noAlertsMessage.classList.add('hidden');
            alerts.forEach(alert => {
                const listItem = document.createElement('li');
                listItem.classList.add('bg-red-600', 'text-white', 'p-4', 'rounded-2xl', 'shadow-lg', 'flex', 'flex-col', 'items-start', 'justify-between', 'md:flex-row', 'md:items-center', 'transform', 'hover:scale-105', 'transition-transform');
                listItem.innerHTML = `
                    <div>
                        <span class="font-bold text-lg">Alerta: ${alert.title}</span>
                        <p class="text-sm opacity-90">${alert.description}</p>
                    </div>
                    <button class="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-xl mt-3 md:mt-0 remove-alert focus:outline-none focus:ring-2 focus:ring-red-300" data-id="${alert.id}">
                        Resolver
                    </button>
                `;
                activeAlertsList.appendChild(listItem);
            });
        } else {
            noAlertsMessage.classList.remove('hidden');
        }
    };

    const handleRemoveAlert = (id) => {
        const indexToRemove = alerts.findIndex(alert => alert.id === id);
        if (indexToRemove !== -1) {
            const marker = alerts[indexToRemove].marker;
            if (marker) {
                map.removeLayer(marker);
            }
            alerts.splice(indexToRemove, 1);
            updateAlertsList();
        }
    };
    
    async function getGeminiAlertDescription(alertType) {
        const prompt = `Genera una breve pero detallada descripción para una alerta de ${alertType}.`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: {
                parts: [{ text: "Act as an emergency alert system. Provide a concise and detailed description of a natural disaster alert. The response should be a single paragraph." }]
            },
        };
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('API did not return a valid description.');
            
            return text.trim();
        } catch (error) {
            console.error('Error fetching alert description from Gemini API:', error);
            return `Se ha detectado una emergencia de ${alertType} en la zona. Tome las precauciones necesarias.`;
        }
    }

    map.on('click', async (event) => {
        const latLng = event.latlng;
        const alertType = alertTypeSelect.value;
        
        if (!alertType) {
            statusMessage.textContent = 'Por favor, selecciona un tipo de alerta primero.';
            return;
        }

        statusMessage.textContent = 'Generando alerta...';
        loadingSpinner.classList.remove('hidden');
        
        try {
            const description = await getGeminiAlertDescription(alertType);
            
            if (description.startsWith('Se ha detectado una emergencia')) {
                showTemporaryMessage(errorMessage);
            } else {
                showTemporaryMessage(alertMessage);
            }

            const alertData = {
                id: markerId++,
                title: alertType.charAt(0).toUpperCase() + alertType.slice(1),
                description: description,
                coords: latLng,
                timestamp: new Date().toLocaleTimeString()
            };
            
            const svgIcon = `
            <svg class="alert-marker-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            `;

            const alertIcon = L.divIcon({
                className: 'custom-div-icon',
                html: svgIcon,
                iconSize: [40, 40]
            });
            const marker = L.marker(alertData.coords, { icon: alertIcon }).addTo(map);
            marker.bindPopup(`
                <div style="font-family: 'Inter', sans-serif;">
                    <b>Alerta de ${alertData.title}</b><br>
                    <hr style="margin: 4px 0;">
                    <p>${alertData.description}</p>
                    <small style="color: #6b7280; display: block; margin-top: 8px;">Ubicación: ${alertData.coords.lat.toFixed(4)}, ${alertData.coords.lng.toFixed(4)}</small>
                    <small style="color: #6b7280; display: block;">Hora: ${alertData.timestamp}</small>
                </div>
            `).openPopup();
            
            alertData.marker = marker;
            
            alerts.push(alertData);
            updateAlertsList();
            
            map.flyTo(alertData.coords, 14);

        } catch (error) {
            console.error("Failed to create alert:", error);
        } finally {
            loadingSpinner.classList.add('hidden');
            statusMessage.textContent = 'Haz clic en el mapa para colocar una alerta.';
        }
    });

    activeAlertsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-alert')) {
            const id = parseInt(event.target.dataset.id, 10);
            handleRemoveAlert(id);
        }
    });

    updateAlertsList();
});