import React, { useState, useEffect } from 'react';
import { fetchPOIs } from '../api';
import { MapPin } from 'lucide-react';

const Map = () => {
  const [pois, setPois] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchPOIs().then(setPois);
  }, []);

  return (
    <div className="map-container">
      {/* Replace URL with your actual MW.jpg path */}
      <img src="/MW.png" alt="Mann Wood Map" className="main-map" />
      
      {pois.map(poi => (
        <div 
          key={poi.id}
          className="poi-marker"
          style={{ left: `${poi.x_pos}%`, top: `${poi.y_pos}%` }}
          onClick={() => setSelected(poi)}
        >
          <MapPin size={32} color="white" fill="#2d5a27" />
        </div>
      ))}

      {selected && (
        <div className="info-popup">
          <h3>{selected.name}</h3>
          <p>{selected.description}</p>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Map;