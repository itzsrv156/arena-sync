import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ShieldAlert, ActivitySquare, AlertCircle } from 'lucide-react';

const getRiskColor = (risk) => {
  if (risk > 85) return 'var(--accent-red)';
  if (risk > 60) return 'var(--accent-yellow)';
  return 'rgba(255,255,255,0.4)'; // Subdued green/clear for Apple style
};

export default function StadiumMap({ data, aiAnalysis, matchPhase }) {
  const [selected, setSelected] = useState(null);
  const [is3D, setIs3D] = useState(false);
  const stands = data.stands;
  const gates = data.gates;
  const riskScores = aiAnalysis?.riskScores || {};
  const alerts = aiAnalysis?.alerts || [];

  // Generate generic flow paths dynamically
  const generateFlowPath = (gate, index) => {
    // Mapping 4 gates to center points
    const startPoints = [
      { x: 250, y: 10 }, { x: 490, y: 250 }, { x: 250, y: 490 }, { x: 10, y: 250 }
    ];
    // Map to stands
    const endPoints = [
      { x: 250, y: 100 }, { x: 400, y: 250 }, { x: 250, y: 400 }, { x: 100, y: 250 }
    ];
    
    // Only animate if ingress is high
    const isActive = gate.currentLoadPerMinute > 60;
    
    return (
      <motion.path
        key={`flow-${gate.id}`}
        d={`M ${startPoints[index%4].x} ${startPoints[index%4].y} Q ${250} ${250} ${endPoints[index%4].x} ${endPoints[index%4].y}`}
        fill="transparent"
        stroke={isActive ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? [0, 1, 0] : 0 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{ pointerEvents: 'none' }}
      />
    );
  };

  const getOverlayData = (node) => {
    const risk = riskScores[node.id] || 0;
    const alert = alerts.find(a => a.id.includes(node.id));
    return { risk, alert };
  };

  return (
    <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}>
      
      {/* View Toggle */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
        <button 
          onClick={() => setIs3D(!is3D)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: is3D ? 'var(--accent-purple)' : 'rgba(255,255,255,0.05)',
            border: is3D ? '1px solid var(--accent-purple)' : '1px solid rgba(255,255,255,0.1)',
            color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.3s ease', boxShadow: is3D ? '0 0 15px var(--accent-purple)' : 'none'
          }}
        >
           <Box size={16} />
           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{is3D ? '2D Projection' : '3D Topography'}</span>
        </button>
      </div>

      {/* SPATIAL VECTOR MAP */}
      <motion.div 
        animate={{ 
           rotateX: is3D ? 55 : 0, 
           rotateZ: is3D ? -35 : 0, 
           scale: is3D ? 0.9 : 1
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ position: 'relative', width: '500px', height: '500px', transformStyle: 'preserve-3d' }}
      >
        {/* Core Geometry */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) ${is3D ? 'translateZ(-15px)' : ''}`,
          width: '540px', height: '540px', borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 80%, rgba(255, 255, 255, 0.05) 100%)',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)', zIndex: -2
        }}></div>

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

          {/* Animated Flows */}
          {matchPhase !== 'break' && gates.map((g, i) => generateFlowPath(g, i))}

          {/* Stands & Interactivity */}
          {stands.map((stand, i) => {
            const { risk, alert } = getOverlayData(stand);
            const isCritical = risk > 85;
            
            // Map stand zones identically to before but now interactive
            const radius = 200;
            const angleStart = (i * 90) * (Math.PI / 180);
            const angleEnd = ((i + 1) * 90 - 5) * (Math.PI / 180);
            const x1 = 250 + radius * Math.cos(angleStart);
            const y1 = 250 + radius * Math.sin(angleStart);
            const x2 = 250 + radius * Math.cos(angleEnd);
            const y2 = 250 + radius * Math.sin(angleEnd);

            // Inner radius logic
            const innerRadius = 110;
            const ix1 = 250 + innerRadius * Math.cos(angleStart);
            const iy1 = 250 + innerRadius * Math.sin(angleStart);
            const ix2 = 250 + innerRadius * Math.cos(angleEnd);
            const iy2 = 250 + innerRadius * Math.sin(angleEnd);

            const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1} Z`;

            return (
              <g key={stand.id} onClick={() => setSelected(stand)} style={{ cursor: 'pointer' }}>
                <path 
                   d={pathData} 
                   fill="rgba(0,0,0,0.85)" 
                   stroke="rgba(255,255,255,0.05)" 
                   strokeWidth="1"
                   filter="url(#structuralShadow)"
                />
                
                <motion.path
                  d={pathData}
                  fill={selected?.id === stand.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}
                  stroke={getRiskColor(risk)}
                  strokeWidth={selected?.id === stand.id ? 2 : 1}
                  animate={{ 
                     opacity: isCritical ? [0.6, 1, 0.6] : 1,
                     filter: isCritical ? 'url(#vectorGlow)' : 'none'
                  }}
                  transition={{ duration: 1.5, repeat: isCritical ? Infinity : 0 }}
                  whileHover={{ fill: 'rgba(255,255,255,0.08)' }}
                  style={{ transform: is3D ? 'translateZ(10px)' : 'none', transition: '0.5s' }}
                />
                
                {alert && (
                   <circle cx={(x1+ix2)/2} cy={(y1+iy2)/2} r="10" fill="var(--accent-red)" filter="url(#vectorGlow)">
                      <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                   </circle>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Floating Dynamic Analytics Panel */}
      <div style={{ flex: 1, minWidth: '300px', height: '100%' }}>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel"
              style={{
                height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', 
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(0,0,0,0.8))'
              }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                 <div>
                   <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>{selected.name}</h3>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tactical Vector Block {selected.id}</span>
                 </div>
                 <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', borderLeft: `3px solid ${getRiskColor((selected.occupancy/selected.capacity)*100)}` }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>SATURATION</div>
                     <div style={{ fontSize: '1.6rem', fontWeight: 600, color: getRiskColor((selected.occupancy/selected.capacity)*100) }}>
                       {Math.round((selected.occupancy/selected.capacity)*100)}%
                     </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', borderLeft: '3px solid var(--accent-blue)' }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>HARD COUNT</div>
                     <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>{selected.occupancy.toLocaleString()}</div>
                  </div>
               </div>

               {alerts.find(a => a.id.includes(selected.id)) ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--accent-red)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      <AlertCircle size={16} /> Automated AI Directive
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', lineHeight: 1.5 }}>
                       {alerts.find(a => a.id.includes(selected.id)).recommendation}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', marginTop: '8px' }}>
                       Reasoning: {alerts.find(a => a.id.includes(selected.id)).effect}
                    </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px', opacity: 0.5 }}>
                    <ActivitySquare size={24} color="var(--accent-green)" />
                    <span style={{ fontSize: '0.85rem' }}>No active intelligence directives for this sector.</span>
                 </div>
               )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-panel"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center', opacity: 0.7 }}
            >
               <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                 Awaiting tactical telemetry stream.<br />Click an interactive stadium sector on the map<br />to isolate telemetry and AI intelligence.
               </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}