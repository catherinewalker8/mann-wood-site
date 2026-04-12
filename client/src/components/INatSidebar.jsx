import React from 'react';
import { Squirrel, ExternalLink, Camera, MapPin } from 'lucide-react';

// Receiving observations and loading as props from App.jsx
const INatSidebar = ({ observations, loading }) => {
  
  // Mann Wood Coordinates (for the "View Full Map" link)
  const LAT = 51.761;
  const LNG = 0.492;
  const RADIUS = 1;

  if (loading) {
    return (
      <div className="p-4 text-center text-muted small animate-pulse">
        <Squirrel className="mb-2 text-success opacity-50" size={24} />
        <p>Scanning Mann Wood for wildlife...</p>
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush px-1">
      {/* Header Label */}
      <div className="px-3 py-2 bg-light rounded mb-3 d-flex align-items-center">
        <MapPin size={14} className="text-success me-2" />
        <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>
          Local Observations
        </span>
      </div>

      {/* Observation List */}
      {observations && observations.length > 0 ? (
        observations.map((obs) => (
          <a 
            key={obs.id} 
            href={obs.uri} 
            target="_blank" 
            rel="noreferrer" 
            className="list-group-item list-group-item-action border-0 py-3 mb-2 shadow-sm rounded bg-white"
          >
            <div className="d-flex align-items-center">
              {/* Species Image */}
              {obs.photos?.[0] ? (
                <img 
                  src={obs.photos[0].url.replace('square', 'small')} 
                  alt={obs.species_guess} 
                  className="rounded me-3 border" 
                  style={{ width: '55px', height: '55px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center border" style={{ width: '55px', height: '55px' }}>
                  <Camera size={20} className="text-muted" />
                </div>
              )}

              {/* Species Text */}
              <div className="overflow-hidden">
                <h6 className="mb-0 text-truncate fw-bold" style={{ fontSize: '0.85rem', color: '#1b4d3e' }}>
                  {obs.species_guess || 'Unknown Organism'}
                </h6>
                <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                  by {obs.user?.login || 'Observer'}
                </div>
                <div className="text-success fw-bold mt-1" style={{ fontSize: '0.7rem' }}>
                  {obs.created_at 
                    ? new Date(obs.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    : 'Recent'}
                </div>
              </div>
            </div>
          </a>
        ))
      ) : (
        <div className="text-center text-muted p-4 small bg-white rounded shadow-sm">
          <p className="mb-0">No recent sightings at this location.</p>
        </div>
      )}

      {/* Footer Link */}
      <div className="p-2 mt-2">
        <a 
          href={`https://www.inaturalist.org/observations?lat=${LAT}&lng=${LNG}&radius=${RADIUS}`}
          target="_blank" 
          rel="noreferrer" 
          className="btn btn-outline-success btn-sm w-100 fw-bold border-2"
        >
          View Full Location Map <ExternalLink size={14} className="ms-1" />
        </a>
      </div>
    </div>
  );
};

export default INatSidebar;