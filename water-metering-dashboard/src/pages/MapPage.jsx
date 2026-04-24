import React, { useState, useEffect } from 'react'; // Ajout de useState et useEffect
import axios from 'axios'; // Ajout de l'import axios
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Correction icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [meters, setMeters] = useState([]); // Doit être INSIDE la fonction

  useEffect(() => {
    const fetchMeters = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/compteurs');
        // On filtre pour n'afficher que ceux qui ont des coordonnées
        const withGPS = response.data.filter(m => m.latitude && m.longitude);
        setMeters(withGPS);
      } catch (error) {
        console.error("Erreur chargement carte:", error);
      }
    };
    fetchMeters();
  }, []);

  const centerPosition = [37.2246, 10.0940];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Géolocalisation du Parc</h1>
      <div style={{ height: '75vh', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <MapContainer center={centerPosition} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {meters.map((meter) => (
            <Marker key={meter.id} position={[meter.latitude, meter.longitude]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-blue-700">{meter.nom || meter.id}</h3>
                  <p className="text-sm"><b>Zone:</b> {meter.localisation_atelier}</p>
                  <hr className="my-2" />
                  <button 
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded w-full"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${meter.latitude},${meter.longitude}`)}
                  >
                    Itinéraire
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