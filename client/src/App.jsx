import React from 'react';
import Map from './components/Map';
import './App.css';
import { BookOpen, Heart, Leaf, Users } from 'lucide-react';

function App() {
  return (
    <div className="app">
      <header>
        <div className="logo-section">
          <img src="/wf-logo.png" alt="Wilderness Foundation" className="wf-logo" />
          <h1>MANN WOOD</h1>
        </div>
        <nav>
          {['About', 'Visit', 'Impact', 'Donate', 'Contact'].map(item => (
            <button key={item}>{item}</button>
          ))}
        </nav>
      </header>

      <main>
        <div className="sidebar left">
          <div className="icon-box education">
            <BookOpen /> <h3>Education</h3>
            <p>Discover, Play, Learn</p>
          </div>
          <div className="icon-box volunteering">
            <Users /> <h3>Volunteering</h3>
            <p>Conserving nature through practical tools and skills.</p>
          </div>
        </div>

        <Map />

        <div className="sidebar right">
          <div className="icon-box therapy">
            <Heart /> <h3>Therapy</h3>
            <p>Immersive nature therapy programs.</p>
          </div>
          <div className="icon-box environment">
            <Leaf /> <h3>Environment</h3>
            <p>Preserving the Essex landscape.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;