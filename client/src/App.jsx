import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import INatSidebar from './components/INatSidebar';
import { BookOpen, Heart, Leaf, Users, Squirrel, Info, ExternalLink } from 'lucide-react';

function App() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const PLACE_ID = 226237;

  useEffect(() => {
    fetch(`https://api.inaturalist.org/v1/observations?place_id=${PLACE_ID}&per_page=100&order=desc&order_by=created_at`)
      .then(res => res.json())
      .then(data => {
        setObservations(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching iNat data:", err);
        setLoading(false);
      });
  }, []);

  const impactAreas = [
    { icon: <BookOpen />, title: "Education", text: "Discover, Play, Learn", color: "#82bc00" },
    { icon: <Heart />, title: "Therapy", text: "Transforming lives through nature", color: "#00a1e4" },
    { icon: <Users />, title: "Volunteering", text: "Hands-on work in conservation", color: "#f39200" },
    { icon: <Leaf />, title: "Environment", text: "Protecting our woods for the future", color: "#2d5a27" }
  ];

  const treeSpecies = [
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
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 mb-4 shadow-sm">
        <div className="container-fluid px-4">
          {/* 1. Brand Group - flex-grow-1 pushes everything else to the right */}
          <a className="navbar-brand d-flex align-items-center flex-grow-1" href="/">
            <img src="/wf-logo.png" alt="WF Logo" height="60" className="me-3" />
            <div className="d-flex flex-column">
              <span className="fw-bold text-success fs-2 lh-1" style={{ letterSpacing: '2px' }}>
                MANN WOOD
              </span>
            </div>
          </a>

          {/* 2. Standard Bootstrap Toggler for Mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 3. Navigation Links - ms-auto ensures it sticks to the right edge */}
          <div className="collapse navbar-collapse flex-grow-0" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {['About', 'Visit', 'Impact', 'Contact'].map(item => (
                <li className="nav-item" key={item}>
                  <a className="nav-link fw-bold px-3 text-uppercase text-dark" style={{ fontSize: '0.8rem' }} href={`#${item.toLowerCase()}`}>
                    {item}
                  </a>
                </li>
              ))}
              <li className="nav-item ms-lg-4">
                <a className="btn btn-success rounded-pill px-4 fw-bold shadow-sm" href="#donate">
                  DONATE
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container-fluid px-4">
        {/* Main Dashboard Row */}
        <div className="row g-4 mb-5" style={{ minHeight: '650px' }}>
          
          {/* Left Column: Map (75%) */}
          <div className="col-lg-9">
            <div className="card shadow-sm border-0 h-100 overflow-hidden">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">Explore the Woods</h5>
              </div>
              {/* Ensure your Map component uses style={{height: '100%'}} internally */}
              <div className="flex-grow-1">
                <Map sightings={observations} />
              </div>
            </div>
          </div>

          {/* Right Column: Info Panel (25%) */}
          <div className="col-lg-3 d-flex flex-column" style={{ height: '650px' }}>
            
            {/* 1. Sightings Card (Flexible height) */}
            <div className="card shadow-sm border-0 mb-3 flex-grow-1 overflow-hidden d-flex flex-column">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="mb-0 fw-bold d-flex align-items-center">
                  <Squirrel size={18} className="me-2 text-success" /> Recent Sightings
                </h6>
              </div>
              <div className="card-body p-2 bg-light overflow-auto">
                <INatSidebar observations={observations} loading={loading} />
              </div>
              <div className="card-footer bg-white border-0 pt-3 pb-3 px-3">
                    <a 
                      href={`https://www.inaturalist.org/observations?place_id=${PLACE_ID}`}
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-success btn-sm w-100 fw-bold mb-2 shadow-sm d-flex align-items-center justify-content-center"
                      style={{ fontSize: '0.75rem', padding: '8px' }}
                    >
                      View on INaturalist <ExternalLink size={14} className="ms-2" />
                    </a>
                  </div>
            </div>

            {/* 2. Tree Species Legend Card */}
            <div className="card shadow-sm border-0 p-3">
              <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: '0.9rem' }}>Tree Species Key</h6>
              <div className="row g-2">
                {treeSpecies.map((s) => (
                  <div key={s.name} className="col-6 d-flex align-items-start gap-2" style={{ fontSize: '12px' }}>
                    <span style={{ 
                      height: '10px', width: '10px', backgroundColor: s.color, 
                      borderRadius: '50%', border: '1px solid #999', flexShrink: 0
                    }}></span>
                    <span className="text-muted text-start text-wrap lh-sm">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: IMPACT BOXES */}
        <div className="container">
          <div className="row g-4">
            {impactAreas.map((area, index) => (
              <div className="col-md-3" key={index}>
                <div className="card h-100 border-0 shadow-sm text-center p-4 impact-card">
                  <div className="icon-wrapper mb-3" style={{ color: area.color }}>
                    {area.icon}
                  </div>
                  <h6 className="fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>{area.title}</h6>
                  <p className="small text-muted mb-0">{area.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;