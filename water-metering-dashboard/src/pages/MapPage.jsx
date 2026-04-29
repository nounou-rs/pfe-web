import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMeters } from '../context/MetersContext'; // Import du hook

// Correction icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  // On récupère les données et la fonction de rafraîchissement du Context
  const { meters, refreshMeters } = useMeters();

  // On force une petite synchronisation quand on arrive sur la page
  useEffect(() => {
    refreshMeters();
  }, []);

  const centerPosition = [37.2246, 10.0940];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Géolocalisation du Parc Wicmic</h1>
      
      <div style={{ height: '75vh', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <MapContainer center={centerPosition} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {meters.map((meter) => (
            <Marker key={meter.id} position={[meter.latitude, meter.longitude]}>
              <Popup>
                <div className="p-1" style={{ minWidth: '150px' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#1d4ed8', margin: 0 }}>{meter.nom || meter.id}</h3>
                  <p style={{ fontSize: '0.85rem', margin: '5px 0' }}>
                    <b>Atelier:</b> {meter.localisation_atelier}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Lat: {meter.latitude.toFixed(4)} | Lon: {meter.longitude.toFixed(4)}
                  </div>
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <button 
                    style={{ 
                      backgroundColor: '#2563eb', color: 'white', border: 'none', 
                      padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', width: '100%' 
                    }}
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${meter.latitude},${meter.longitude}`)}
                  >
                    Itinéraire Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;