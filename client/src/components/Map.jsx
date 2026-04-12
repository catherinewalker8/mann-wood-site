import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';


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

const woodlandBounds = [
  [0.529936395487755, 51.829249708319736], // SouthWest corner
  [59.765, 0.495]  // NorthEast corner
];

// Color Palette for Specific Species
const speciesPalette = {
  'Oak': '#1a4301',            // Deep Forest Green
  'Hornbeam': '#4a6741',        // Mossy Green
  'Birch': '#d1d1d1',          // Silver/White
  'Hazel': '#7eb34a',          // Spring Green
  'Sweet Chestnut': '#8b4513', // Saddle Brown
  'Field Maple': '#e67e22',    // Autumnal Orange
  'Ash': '#95a5a6',            // Pale Ash Grey
  'Lime': '#cddc39'            // Vibrant Lime
};

export default function WoodlandMap() {
  const [data, setData] = useState({ trees: null, comps: null });
  const [map, setMap] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/trees.json').then(res => res.json()),
      fetch('/data/compartments.json').then(res => res.json())
    ]).then(([trees, comps]) => setData({ trees, comps }));
  }, []);

  useEffect(() => {
    if (map && data.comps && data.comps.features.length > 0) {
      const geoJsonLayer = L.geoJSON(data.comps);
      map.fitBounds(geoJsonLayer.getBounds());
    }
  }, [map, data.comps]);

  if (!data.trees || !data.comps) {
  return (
    <div style={{ height: "700px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #ccc" }}>
      <p style={{ color: "#666" }}>
        { !data.trees ? "⏳ Loading Trees (Large File)..." : "Checking Compartments..." }
      </p>
    </div>
  );
}

return (  
  <div style={{ height: "500px", width: "100%", position: "relative", zIndex: 1 }}>
    <Legend />
    <MapContainer 
      ref={setMap}
      minZoom={15}       
      maxZoom={19}           
      maxBounds={woodlandBounds} 
      maxBoundsViscosity={1.0}
      center={[51.76, 0.49]} 
      zoom={16} 
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", minHeight: "500px" }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 2. High Density Trees */}
      {data.trees && data.trees.features.map((tree, i) => {
        // Safety check: skip if coordinates are missing
        if (!tree.geometry || !tree.geometry.coordinates) return null;
        
        return (
          <CircleMarker 
            key={`tree-${i}`}
            center={[tree.geometry.coordinates[1], tree.geometry.coordinates[0]]}
            radius={tree.properties.dbh_cm * 0.5} 
            pathOptions={{ 
              fillColor: speciesPalette[tree.properties.species] || '#333',
              color: 'white',
              weight: 0.3,
              fillOpacity: 0.9 
            }}
          >
            <Popup>
              <strong>{tree.properties.species}</strong><br/>
              DBH: {tree.properties.dbh_cm}cm
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  </div>
);
}