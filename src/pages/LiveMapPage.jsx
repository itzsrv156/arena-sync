import React from 'react';
import { useOutletContext } from 'react-router-dom';
import StadiumMap from '../components/StadiumMap';

export default function LiveMapPage() {
  const { stadiumData, aiAnalysis, matchPhase } = useOutletContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Digital Twin Spatial Vector</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time vector tracing and density plotting mapped to risk scores.</p>
      </div>
      
      <div className="glass-panel mobile-map-container" style={{ flex: 1, minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <StadiumMap data={stadiumData} aiAnalysis={aiAnalysis} matchPhase={matchPhase} />
      </div>
    </div>
  );
}
