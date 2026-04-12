import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BookOpen, Heart, Leaf, Users, Squirrel, Info } from 'lucide-react';
import INatSidebar from './components/INatSidebar';

function App() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mann Wood Coordinates
  const LAT = 51.761;
  const LNG = 0.492;

  // 1. Fetch iNaturalist data here so both Map and Sidebar can use it
  useEffect(() => {
    fetch(`https://api.inaturalist.org/v1/observations?lat=${LAT}&lng=${LNG}&radius=1&per_page=15&order=desc&order_by=created_at`)
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
    { icon: <BookOpen />, title: "Education", text: "Nature is the classroom.", color: "#82bc00" },
    { icon: <Heart />, title: "Therapy", text: "Nature as a therapeutic tool.", color: "#00a1e4" },
    { icon: <Users />, title: "Volunteering", text: "Practical tasks preserve ancient woodland.", color: "#f39200" },
    { icon: <Leaf />, title: "Environment", text: "Protecting biodiversity for the future.", color: "#2d5a27" }
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 mb-4 shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/wf-logo.png" alt="WF Logo" height="40" className="me-3" />
            <span className="fw-bold text-success" style={{ letterSpacing: '1px' }}>MANN WOOD</span>
          </a>
        </div>
      </nav>

      <main className="container-fluid px-4">
        <div className="row g-4 mb-5">
          {/* Map (75% width) - Now receives observations as a prop */}
          <div className="col-lg-9">
            <div className="card shadow-sm border-0 h-100 overflow-hidden" style={{ minHeight: '600px' }}>
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">Explore the Woods</h5>
                <span className="badge bg-light text-success border">
                  {observations.length} Wildlife Sightings
                </span>
              </div>
              <Map sightings={observations} />
            </div>
          </div>

          {/* iNaturalist Sidebar (25% width) */}
          <div className="col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="mb-0 fw-bold d-flex align-items-center">
                  <Squirrel size={18} className="me-2 text-success" /> Recent Sightings
                </h6>
              </div>
              
              <div className="card-body p-2 bg-light" style={{ height: '520px', overflowY: 'auto' }}>
                {/* Pass the data and loading state to the sidebar */}
                <INatSidebar observations={observations} loading={loading} />
              </div>

              <div className="card-footer bg-white border-0 py-3 text-center">
                <p className="mb-0 text-muted small d-flex align-items-center justify-content-center">
                  <Info size={14} className="me-1" /> 
                  Powered by <strong>iNaturalist</strong>
                </p>
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