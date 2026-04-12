import React from 'react';
import Map from './components/Map';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './App.css';
import { BookOpen, Heart, Leaf, Users } from 'lucide-react';

function App() {
  const impactAreas = [
    { icon: <BookOpen />, title: "Education", text: "Discover, Play, Learn", color: "#82bc00" },
    { icon: <Heart />, title: "Therapy", text: "Nature as a therapeutic tool.", color: "#00a1e4" },
    { icon: <Users />, title: "Volunteering", text: "Practical tasks to conserve woodland.", color: "#f39200" },
    { icon: <Leaf />, title: "Environment", text: "Protecting biodiversity for the future.", color: "#2d5a27" }
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar Style like Wilderness Foundation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 sticky-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src="/wf-logo.png" alt="WF Logo" height="50" className="me-3" />
            <span className="fw-bold text-success" style={{ letterSpacing: '2px' }}>MANN WOOD</span>
          </a>
          <div className="ms-auto d-none d-md-block">
            {['About', 'Visit', 'Impact', 'Donate', 'Contact'].map(item => (
              <button key={item} className="btn btn-link text-decoration-none text-dark fw-bold px-3">{item}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container py-4">
        {/* Map Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
              <Map />
            </div>
          </div>
        </div>

        {/* Impact Boxes Section - Now in a line of four below the map */}
        <div className="row g-4">
          {impactAreas.map((area, index) => (
            <div className="col-md-3" key={index}>
              <div className="card h-100 border-0 shadow-sm text-center p-4 impact-card">
                <div className="icon-wrapper mb-3" style={{ color: area.color }}>
                  {area.icon}
                </div>
                <h5 className="fw-bold text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>{area.title}</h5>
                <p className="small text-muted mb-0">{area.text}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <small>&copy; 2026 Wilderness Foundation UK.</small>
        </div>
      </footer>
    </div>
  );
}

export default App;