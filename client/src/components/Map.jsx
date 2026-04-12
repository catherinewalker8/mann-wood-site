import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const [data, setData] = useState({ trees: null, compartments: null });

  useEffect(() => {
    // Fetching from the public folder (Vite serves this at the root)
    Promise.all([
      fetch('/data/trees.json').then((res) => res.json()),
      fetch('/data/compartments.json').then((res) => res.json()),
    ])
      .then(([trees, compartments]) => {
        setData({ trees, compartments });
      })
      .catch((err) => console.error("Error loading woodland data:", err));
  }, []);

  // Styling for the woodland compartments
  const compartmentStyle = {
    fillColor: '#2d5a27',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.2,
  };

  if (!data.trees || !data.compartments) {
    return <div style={{ padding: '20px' }}>Loading Woodland Map...</div>;
  }

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <MapContainer 
        center={[51.5, -0.1]} // This will be overridden if you use bounds, but it's a safe start
        zoom={17} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Compartment Polygons */}
        <GeoJSON 
          data={data.compartments} 
          style={compartmentStyle} 
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <strong>Compartment: ${feature.properties.id || 'N/A'}</strong><br/>
              Last Cut: ${feature.properties.years_since_cut} years ago
            `);
          }}
        />

        {/* 2. Proportional Tree Markers */}
        {data.trees.features.map((tree, idx) => (
          <CircleMarker
            key={idx}
            center={[
              tree.geometry.coordinates[1], // Latitude
              tree.geometry.coordinates[0]  // Longitude
            ]}
            // Scaling the radius based on DBH (the "Proportional" part)
            radius={tree.properties.dbh_cm * 0.4} 
            pathOptions={{
              // Red if disease exists, Dark Green if healthy
              fillColor: tree.properties.disease !== 'None' ? '#e74c3c' : '#1b4d3e',
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0.8,
            }}
          >
            <Popup>
              <div style={{ fontSize: '14px' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{tree.properties.species}</h4>
                <hr />
                <b>DBH:</b> {tree.properties.dbh_cm} cm<br />
                <b>Stems:</b> {tree.properties.stems}<br />
                <b>Health:</b> {tree.properties.disease}<br />
                <b>Year of Last Cut:</b> {tree.properties.last_cut}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;