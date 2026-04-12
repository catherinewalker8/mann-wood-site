import React from 'react';
import { Squirrel, Camera} from 'lucide-react';

// Receiving observations and loading as props from App.jsx
const INatSidebar = ({ observations, loading }) => {

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
                    ? new Date(obs.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
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

    </div>
  );
};

export default INatSidebar;