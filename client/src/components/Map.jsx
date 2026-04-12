import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

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

export default function WoodlandMap({ sightings = [] }) {
  const [data, setData] = useState({ trees: null, comps: null });
  const [map, setMap] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/trees.json').then(res => res.json()),
      fetch('/data/compartments.json').then(res => res.json())
    ]).then(([trees, comps]) => setData({ trees, comps }));
  }, []);

  // useEffect(() => {
  //   if (map && data.trees && data.trees.features.length > 0) {
  //     const geoJsonLayer = L.geoJSON(data.trees);
  //     map.fitBounds(geoJsonLayer.getBounds(), { 
  //     padding: [20, 20], 
  //     maxZoom: 18 
  //   });
  //   }
  // }, [map, data.trees]);

  if (!data.trees) {
    return (
      <div style={{ height: "600px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #ccc" }}>
        <p style={{ color: "#666" }}>⏳ Loading Woodland Data...</p>
      </div>
    );
  }

  return (  
    <div style={{ height: "600px", width: "100%", position: "relative", zIndex: 1 }}>
      <MapContainer 
        zoomSnap={0.1} 
        zoomDelta={0.5}
        ref={setMap}
        minZoom={15.7}       
        maxZoom={18}           
        maxBoundsViscosity={1.0}
        center={[51.82659367598204, 0.5268634500766542]} 
        zoom={15.7} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }} 
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Permanent Tree Layer */}
        {data.trees.features.map((tree, i) => {
          if (!tree.geometry || !tree.geometry.coordinates) return null;
          return (
            <CircleMarker 
              key={`tree-${i}`}
              center={[tree.geometry.coordinates[1], tree.geometry.coordinates[0]]}
              radius={tree.properties.dbh_cm * 0.4} 
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

        {/* 2. Photo Markers for Sightings */}
        {sightings.map(obs => {
          if (!obs.location || !obs.photos?.[0]) return null;
          const [lat, lng] = obs.location.split(',').map(Number);

          const photoIcon = L.divIcon({
            className: 'custom-inat-icon',
            html: `
              <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #fd7e14; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.3); background-color: white;">
                <img src="${obs.photos[0].url.replace('square', 'small')}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
          });

          return (
            <Marker key={obs.id} position={[lat, lng]} icon={photoIcon}>
              {/* Set minWidth and maxWidth to force a landscape shape */}
              <Popup minWidth={320} maxWidth={400} autoPanPadding={[50, 50]}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '2px'
                }}>
                  {/* Left Side: Image */}
                  <img 
                    src={obs.photos[0].url.replace('square', 'medium')} 
                    alt={obs.species_guess} 
                    style={{ 
                      width: '120px', 
                      height: '90px', 
                      objectFit: 'cover', 
                      borderRadius: '6px' 
                    }} 
                  />
                  
                  {/* Right Side: Text Info */}
                  <div style={{ flex: 1 }}>
                    <h6 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#1b4d3e' }}>
                      {obs.species_guess || 'Unknown Species'}
                    </h6>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', lineHeight: '1.2' }}>
                      Spotted by <strong>{obs.user.login}</strong>
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666', lineHeight: '1.2', fontWeight: 'bold' }}>
                    {obs.created_at 
                      ? new Date(obs.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
                      : 'Recent'}
                    </p>
                    <a 
                      href={obs.uri} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ 
                        fontSize: '11px', 
                        color: '#2d5a27', 
                        textDecoration: 'none', 
                        fontWeight: '600',
                        display: 'block'
                      }}
                    >
                      View Full Details →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}