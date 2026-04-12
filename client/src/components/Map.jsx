import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const Legend = () => {
  const species = [
    { name: 'Oak', color: '#1a4301' },
    { name: 'Hornbeam', color: '#4a6741' },
    { name: 'Birch', color: '#d1d1d1' },
    { name: 'Hazel', color: '#7eb34a' },
    { name: 'Sweet Chestnut', color: '#8b4513' },
    { name: 'Field Maple', color: '#e67e22' },
    { name: 'Ash', color: '#95a5a6' },
    { name: 'Lime', color: '#cddc39' }
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
      zIndex: 1000,
      fontSize: '12px',
      fontFamily: 'sans-serif',
      lineHeight: '1.8'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#1b4d3e' }}>Tree Species</h4>
      {species.map((s) => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            height: '12px', 
            width: '12px', 
            backgroundColor: s.color, 
            borderRadius: '50%', 
            display: 'inline-block',
            border: '1px solid #999'
          }}></span>
          {s.name}
        </div>
      ))}
    </div>
  );
};

// Fixed bounds to match the wood's actual area
const woodlandBounds = [
  [51.755, 0.485], 
  [51.768, 0.499]
];

const speciesPalette = {
  'Oak': '#1a4301',
  'Hornbeam': '#4a6741',
  'Birch': '#d1d1d1',
  'Hazel': '#7eb34a',
  'Sweet Chestnut': '#8b4513',
  'Field Maple': '#e67e22',
  'Ash': '#95a5a6',
  'Lime': '#cddc39'
};

// Destructure sightings from props
export default function WoodlandMap({ sightings = [] }) {
  const [data, setData] = useState({ trees: null, comps: null });
  const [map, setMap] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/trees.json').then(res => res.json()),
      fetch('/data/compartments.json').then(res => res.json())
    ]).then(([trees, comps]) => setData({ trees, comps }));
  }, []);

  useEffect(() => {
    if (map && data.trees && data.trees.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data.trees);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  }, [map, data.trees]);

  if (!data.trees) {
    return (
      <div style={{ height: "600px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #ccc" }}>
        <p style={{ color: "#666" }}>⏳ Loading Woodland Data...</p>
      </div>
    );
  }

  return (  
    <div style={{ height: "600px", width: "100%", position: "relative", zIndex: 1 }}>
      <Legend />
      <MapContainer 
        ref={setMap}
        minZoom={15}       
        maxZoom={19}           
        maxBounds={woodlandBounds} 
        maxBoundsViscosity={1.0}
        center={[51.761, 0.492]} 
        zoom={16} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Permanent Tree Survey Layer */}
        {data.trees.features.map((tree, i) => {
          if (!tree.geometry || !tree.geometry.coordinates) return null;
          return (
            <CircleMarker 
              key={`tree-${i}`}
              center={[tree.geometry.coordinates[1], tree.geometry.coordinates[0]]}
              radius={tree.properties.dbh_cm * 0.15} 
              pathOptions={{ 
                fillColor: speciesPalette[tree.properties.species] || '#333',
                color: 'white',
                weight: 0.3,
                fillOpacity: 0.8 
              }}
            >
              <Popup>
                <strong>{tree.properties.species}</strong><br/>
                DBH: {tree.properties.dbh_cm}cm
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 2. Dynamic iNaturalist Sightings Layer */}
        {sightings.map(obs => {
          if (!obs.location) return null;
          const [lat, lng] = obs.location.split(',').map(Number);
          return (
            <CircleMarker 
              key={obs.id} 
              center={[lat, lng]} 
              radius={8} 
              pathOptions={{ 
                fillColor: '#fd7e14', // Distinct orange for animals/plants
                color: 'white', 
                weight: 2, 
                fillOpacity: 1 
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  {obs.photos?.[0] && (
                    <img src={obs.photos[0].url} alt={obs.species_guess} style={{ width: '100px', borderRadius: '4px', marginBottom: '5px' }} />
                  )}
                  <br/>
                  <strong>{obs.species_guess || 'Unknown Species'}</strong><br/>
                  <small>Spotted by {obs.user.login}</small>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}