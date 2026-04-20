import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Box } from 'lucide-react';

const getRiskColor = (risk) => {
  if (risk > 85) return 'var(--accent-red)';
  if (risk > 60) return 'var(--accent-yellow)';
  return 'var(--accent-green)';
};

export default function StadiumMap({ data, aiAnalysis, matchPhase }) {
  const [selected, setSelected] = useState(null);
  const [is3D, setIs3D] = useState(false);
  const stands = data.stands;
  const riskScores = aiAnalysis?.riskScores || {};

  const flowArrows = [];
  if (matchPhase === 'pre-match') {
    flowArrows.push({ id: 'v1', x: 250, y: 10, rot: 90 }); 
    flowArrows.push({ id: 'v2', x: 250, y: 490, rot: -90 }); 
    flowArrows.push({ id: 'v3', x: 10, y: 250, rot: 0 }); 
    flowArrows.push({ id: 'v4', x: 490, y: 250, rot: 180 }); 
  } else if (matchPhase === 'post-match') {
    flowArrows.push({ id: 'v1', x: 250, y: 50, rot: -90 }); 
    flowArrows.push({ id: 'v2', x: 250, y: 450, rot: 90 });
    flowArrows.push({ id: 'v3', x: 50, y: 250, rot: 180 }); 
    flowArrows.push({ id: 'v4', x: 450, y: 250, rot: 0 }); 
  } else if (matchPhase === 'break') {
    flowArrows.push({ id: 'v1', x: 160, y: 250, rot: 180 }); 
    flowArrows.push({ id: 'v2', x: 340, y: 250, rot: 0 }); 
  }

  return (
    <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
      
      {/* View Toggle */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <button 
          onClick={() => setIs3D(!is3D)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: is3D ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
            border: is3D ? '1px solid var(--accent-purple)' : '1px solid var(--border-glass)',
            color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.3s ease', boxShadow: is3D ? '0 0 15px var(--accent-purple)' : 'none'
          }}
        >
           <Box size={16} />
           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{is3D ? '2D Top-Down View' : '3D Isometric View'}</span>
        </button>
      </div>

      {/* SPATIAL VECTOR MAP - HYPER REALISTIC CRICKET OVAL */}
      <motion.div 
        animate={{ 
           rotateX: is3D ? 55 : 0, 
           rotateZ: is3D ? -35 : 0, 
           scale: is3D ? 0.9 : 1
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ position: 'relative', width: '500px', height: '500px', transformStyle: 'preserve-3d' }}
      >
        
        {/* Outer Concourse Ring (Architectural Detailing) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) ${is3D ? 'translateZ(-15px)' : ''}`,
          width: '540px', height: '540px', borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 80%, rgba(255, 255, 255, 0.05) 100%)',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)', zIndex: -2
        }}></div>

        {/* Deep Turf Radial Background */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle at center, #1b4332 0%, #081c15 100%)',
          zIndex: -1,
          boxShadow: is3D ? 'inset 0 0 50px rgba(0,0,0,0.8), 20px 20px 40px rgba(0,0,0,0.5)' : 'none',
          overflow: 'hidden'
        }}>
           {/* Add lawn stripes */}
           <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.02) 15px, rgba(255,255,255,0.02) 30px)' }}></div>
        </div>

        {/* 22-Yard Center Pitch */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '32px', height: '110px', background: 'linear-gradient(to right, #b4a070, #c4b484, #b4a070)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4), 0 0 20px rgba(180, 160, 112, 0.3)'
        }}>
           {/* Batting Creases */}
           <div style={{ position: 'absolute', top: '15px', width: '100%', height: '2px', background: 'rgba(255,255,255,0.8)' }}></div>
           <div style={{ position: 'absolute', bottom: '15px', width: '100%', height: '2px', background: 'rgba(255,255,255,0.8)' }}></div>
           {/* Center Dirt wear */}
           <div style={{ width: '14px', height: '70px', background: 'rgba(92, 74, 46, 0.15)', borderRadius: '4px' }}></div>
        </div>

        {/* 30-Yard Circle Marker */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '220px', height: '220px', borderRadius: '50%',
          border: '1.5px dashed rgba(255,255,255,0.2)', pointerEvents: 'none'
        }}></div>

        {/* Vector Flow Arrows */}
        {flowArrows.map(v => (
          <motion.div
             key={v.id}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1, scale: [0.8, 1, 0.8] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
             style={{
               position: 'absolute', left: v.x, top: v.y, width: '40px', height: '4px',
               marginLeft: '-20px', marginTop: '-2px',
               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
               transform: `rotate(${v.rot}deg) ${is3D ? 'translateZ(10px)' : ''}`,
               boxShadow: '0 0 10px rgba(255,255,255,0.4)',
               zIndex: 20
             }}
          />
        ))}

        <svg width="500" height="500" viewBox="0 0 500 500" style={{ overflow: 'visible', transform: is3D ? 'translateZ(20px)' : 'none', transition: '0.5s' }}>
          <defs>
            <filter id="vectorGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="structuralShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx={is3D ? "25" : "0"} dy={is3D ? "25" : "15"} stdDeviation="15" floodColor="#000" floodOpacity="0.85"/>
            </filter>
          </defs>

          {stands.map((stand, i) => {
            let pathD = "";
            let baseColor = "rgba(40,40,40, 0.95)";
            if (i === 0) pathD = "M 112 112 A 195 195 0 0 1 388 112";      // North Base
            else if (i === 1) pathD = "M 388 388 A 195 195 0 0 1 112 388"; // South Base
            else if (i === 2) pathD = "M 395 119 A 195 195 0 0 1 395 381"; // East Base
            else if (i === 3) pathD = "M 105 381 A 195 195 0 0 1 105 119"; // West Base

            const risk = riskScores[stand.id] || ((stand.occupancy / stand.capacity) * 100);
            const fillCol = getRiskColor(risk);
            const isHovered = selected?.id === stand.id;

            return (
              <g key={stand.id} style={{ cursor: 'pointer' }} onMouseEnter={() => setSelected({ ...stand, risk })} onMouseLeave={() => setSelected(null)}>
                
                {/* 3D Structural Concrete Base Layer */}
                <path d={pathD} fill="none" stroke={baseColor} strokeWidth="58" filter="url(#structuralShadow)" />
                
                {/* Inner Tier Indicator */}
                <path d={pathD} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="50" pointerEvents="none" />
                <path d={pathD} fill="none" stroke="rgba(10,10,10,0.6)" strokeWidth="22" pointerEvents="none" />

                {/* Technical Data Overlay Vector Layer */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={fillCol}
                  strokeWidth="8"
                  opacity={isHovered ? 1 : 0.4}
                  filter={isHovered ? 'url(#vectorGlow)' : 'none'}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: isHovered ? 1.01 : 1, opacity: isHovered ? 1 : 0.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ transformOrigin: '250px 250px' }}
                />
              </g>
            );
          })}
        </svg>

      </motion.div>

      {/* SECURE INTELLIGENCE PANEL */}
      <div style={{ width: '340px', minHeight: '220px', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass-panel"
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: getRiskColor(selected.risk), boxShadow: `0 0 10px ${getRiskColor(selected.risk)}` }}></div>
                  <h2 style={{ fontSize: '1.2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{selected.name}</h2>
                </div>
                {selected.risk >= 90 && <ShieldAlert size={20} color="var(--accent-red)" />}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Pressure Matrix</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: getRiskColor(selected.risk) }}>{selected.risk.toFixed(1)}%</div>
                  </div>
                  <div style={{ background: 'var(--bg-dark)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Fan Density</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 400, color: '#fff', fontFamily: 'monospace' }}>{(selected.occupancy).toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Structural Limit</span>
                      <span>{(selected.capacity).toLocaleString()}</span>
                   </div>
                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, selected.risk)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ height: '100%', background: getRiskColor(selected.risk) }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
             <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel"
              style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
             >
               <span style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Awaiting telemetry stream.<br/>Select an engineered pavilion arc to isolate structural limit vectors.</span>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}