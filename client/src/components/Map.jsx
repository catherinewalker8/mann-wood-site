import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    Promise.all([
      fetch('/data/trees.json').then(res => res.json()),
      fetch('/data/compartments.json').then(res => res.json())
    ]).then(([trees, comps]) => setData({ trees, comps }));
  }, []);

  // Shade compartments by age: Darker = Older/Neglected, Lighter = Recently Cut
  const getCompStyle = (feature) => {
    const age = feature.properties.years_since_cut || 0;
    const color = age > 25 ? '#0b2612' : age > 15 ? '#1b4d3e' : age > 5 ? '#2d8a4e' : '#a2d1a4';
    return { fillColor: color, color: 'white', weight: 1.5, fillOpacity: 0.5 };
  };

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
    <MapContainer 
      center={[51.76, 0.49]} 
      zoom={16} 
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", minHeight: "500px" }} 
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* 1. Shaded Compartments */}
      {data.comps && <GeoJSON data={data.comps} style={getCompStyle} />}

      {/* 2. High Density Trees */}
      {data.trees && data.trees.features.map((tree, i) => {
        // Safety check: skip if coordinates are missing
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