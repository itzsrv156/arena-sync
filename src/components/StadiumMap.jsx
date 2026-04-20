import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, ShieldAlert, AlertTriangle, ArrowRight, Eye, ActivitySquare } from 'lucide-react';

const getRiskParams = (risk) => {
  if (risk > 85) return { color: 'var(--accent-red)', blur: 'var(--accent-red)', speed: 0.3, glow: '10px' };
  if (risk > 60) return { color: 'var(--accent-yellow)', blur: 'var(--accent-yellow)', speed: 0.8, glow: '4px' };
  return { color: 'rgba(56, 189, 248, 0.6)', blur: 'transparent', speed: 2.0, glow: '0px' }; 
};

export default function StadiumMap({ data, aiAnalysis, matchPhase }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [is3D, setIs3D] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const stands = data.stands;
  const gates = data.gates;
  const riskScores = aiAnalysis?.riskScores || {};
  const alerts = aiAnalysis?.alerts || [];

  const generateFlowPath = (gate, index) => {
    // 4 Outer gates pointing inwards through the inter-pavilion gaps
    const startPoints = [
      { x: 250, y: -20 }, { x: 520, y: 250 }, { x: 250, y: 520 }, { x: -20, y: 250 }
    ];
    // Arc towards the inner concourse
    const endPoints = [
      { x: 300, y: 80 }, { x: 420, y: 300 }, { x: 200, y: 420 }, { x: 80, y: 200 }
    ];
    
    const riskParams = getRiskParams(riskScores[gate.id] || 0);
    const isActive = gate.currentLoadPerMinute > 10;
    
    return (
      <g key={`flow-${gate.id}`}>
        <motion.path
          d={`M ${startPoints[index%4].x} ${startPoints[index%4].y} Q 250 250 ${endPoints[index%4].x} ${endPoints[index%4].y}`}
          fill="transparent"
          stroke={isActive ? riskParams.color : 'rgba(255,255,255,0.05)'}
          strokeWidth="3"
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: isActive ? -12 : 0 }}
          transition={{ duration: riskParams.speed, repeat: Infinity, ease: "linear" }}
          style={{ pointerEvents: 'none', filter: `drop-shadow(0 0 5px ${riskParams.blur})` }}
        />
        {/* Origin Gate Node */}
        <circle cx={startPoints[index%4].x} cy={startPoints[index%4].y} r="8" fill={isActive ? riskParams.color : 'rgba(255,255,255,0.1)'} stroke="#000" strokeWidth="2" filter="url(#vectorGlow)" />
      </g>
    );
  };

  const getOverlayData = (node) => {
    const risk = riskScores[node.id] || 0;
    const alert = alerts.find(a => a.id === `stand-${node.id}` || a.id.includes(node.id));
    return { risk, alert, params: getRiskParams(risk) };
  };

  return (
    <div 
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', position: 'relative' }}
    >
      
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
           <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{is3D ? '2D Tactical Matrix' : '3D Spatial Projection'}</span>
        </button>
      </div>

      {/* Removed Floating Interactive Hover Tooltip based on feedback */}

      <motion.div 
        animate={{ 
           rotateX: is3D ? 55 : 0, 
           rotateZ: is3D ? -35 : 0, 
           scale: is3D ? 0.9 : 1
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ position: 'relative', width: '500px', height: '500px', transformStyle: 'preserve-3d' }}
      >
        <svg 
           ref={svgRef}
           onMouseLeave={() => setHovered(null)}
           width="500" height="500" viewBox="0 0 500 500" 
           style={{ overflow: 'visible', transform: is3D ? 'translateZ(20px)' : 'none', transition: '0.5s' }}
        >
          <defs>
            <filter id="vectorGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="standShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx={is3D ? "25" : "5"} dy={is3D ? "25" : "5"} stdDeviation="15" floodColor="#000" floodOpacity="0.9"/>
            </filter>
          </defs>

          {/* Realism: Deep Outer Concourse Ring */}
          <circle cx="250" cy="250" r="235" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" />
          <circle cx="250" cy="250" r="245" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />

          {/* Hyper-Realistic Turf Gradient */}
          <defs>
             <radialGradient id="turfGrad" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stopColor="#1b4332" />
               <stop offset="80%" stopColor="#081c15" />
               <stop offset="100%" stopColor="#040e0a" />
             </radialGradient>
          </defs>
          <circle cx="250" cy="250" r="110" fill="url(#turfGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          
          {/* Lawn Stripes Pattern */}
          <g opacity="0.05">
             <path d="M 140 140 L 360 360 M 150 140 L 370 360 M 160 140 L 380 360 M 170 140 L 390 360" stroke="#fff" strokeWidth="4" />
             <path d="M 360 140 L 140 360 M 370 140 L 150 360 M 380 140 L 160 360 M 390 140 L 170 360" stroke="#fff" strokeWidth="4" />
          </g>

          {/* 30-Yard Dashed Marker */}
          <circle cx="250" cy="250" r="85" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="6 6" />

          {/* 22-Yard Pitch Center */}
          <g transform="rotate(0 250 250)">
            <rect x="238" y="200" width="24" height="100" rx="4" fill="#c4b484" filter="drop-shadow(0px 0px 4px rgba(0,0,0,0.5))" />
            <rect x="242" y="210" width="16" height="80" rx="2" fill="rgba(92, 74, 46, 0.4)" />
            {/* Batting Creases */}
            <line x1="238" y1="215" x2="262" y2="215" stroke="#fff" strokeWidth="1.5" />
            <line x1="238" y1="285" x2="262" y2="285" stroke="#fff" strokeWidth="1.5" />
          </g>

          {/* Animated Flows */}
          {matchPhase !== 'break' && gates.map((g, i) => generateFlowPath(g, i))}

          {/* Architecture - Distant Distinct Pavilion Stands */}
          {stands.map((stand, i) => {
            const { risk, alert, params } = getOverlayData(stand);
            const isSelected = selected?.id === stand.id;
            const isHovering = hovered?.id === stand.id;
            
            const radius = 200;
            const innerRadius = 110;
            
            // Map stand zones identically to before but now interactive
            const angleStart = (i * 90) * (Math.PI / 180);
            const angleEnd = ((i + 1) * 90 - 5) * (Math.PI / 180);
            
            const x1 = 250 + radius * Math.cos(angleStart);
            const y1 = 250 + radius * Math.sin(angleStart);
            const x2 = 250 + radius * Math.cos(angleEnd);
            const y2 = 250 + radius * Math.sin(angleEnd);

            const ix1 = 250 + innerRadius * Math.cos(angleStart);
            const iy1 = 250 + innerRadius * Math.sin(angleStart);
            const ix2 = 250 + innerRadius * Math.cos(angleEnd);
            const iy2 = 250 + innerRadius * Math.sin(angleEnd);

            const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1} Z`;

            return (
              <g 
                key={stand.id} 
                onClick={() => setSelected(stand)}
                onMouseEnter={() => setHovered(stand)}
                style={{ cursor: 'pointer' }}
              >
                {/* 3D Core Block Base */}
                <path 
                   d={pathData} 
                   fill="rgba(10, 15, 25, 0.95)" 
                   stroke="rgba(255,255,255,0.08)" 
                   strokeWidth="1.5"
                   filter="url(#standShadow)"
                />
                
                {/* Dynamic Glass Top Surface */}
                <motion.path
                  d={pathData}
                  fill={isHovering || isSelected ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)'}
                  stroke={isSelected || isHovering || risk > 60 ? params.color : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isSelected || isHovering ? 3 : 1}
                  animate={{ 
                     opacity: risk > 85 ? [0.8, 1, 0.8] : 1,
                     filter: isSelected || risk > 85 ? 'url(#vectorGlow)' : 'none'
                  }}
                  transition={{ duration: 1.5, repeat: risk > 85 ? Infinity : 0 }}
                  style={{ transform: is3D ? 'translateZ(15px)' : 'none', transition: '0.3s' }}
                />

                {/* Heatmap Depth Fill Gradient Override */}
                {(risk > 60) && (
                   <motion.path
                      d={pathData}
                      fill={params.color}
                      opacity={0}
                      animate={{ opacity: [0, 0.25, 0] }}
                      transition={{ duration: params.speed * 4, repeat: Infinity }}
                      style={{ transform: is3D ? 'translateZ(16px)' : 'none' }}
                   />
                )}
                
                {/* Stand Title Rendered on Turf */}
                <text 
                  x={(x1+ix2)/2} y={(y1+iy2)/2} 
                  fill={isHovering || risk > 60 ? params.color : "rgba(255,255,255,0.4)"} 
                  fontSize="12" fontWeight="800" textAnchor="middle" alignmentBaseline="middle"
                  style={{ transform: is3D ? 'translateZ(30px)' : 'none', transition: '0.3s', pointerEvents: 'none' }}
                >
                  {stand.name.substring(0, 3).toUpperCase()}
                </text>
                
                {alert && (
                   <motion.g 
                     transform={`translate(${(x1+ix2)/2 + 25}, ${(y1+iy2)/2 - 12})`}
                     style={{ pointerEvents: 'none' }}
                   >
                      <circle cx="0" cy="0" r="14" fill="rgba(0,0,0,0.8)" stroke="var(--accent-red)" strokeWidth="1.5" />
                      <AlertTriangle size={14} color="var(--accent-red)" x="-7" y="-7" filter="url(#vectorGlow)" />
                   </motion.g>
                )}
              </g>
            );
          })}
        </svg>

      </motion.div>

      {/* Right Side Control Interface (Detailed Zone AI Override) */}
      <div style={{ flex: 1, minWidth: '340px', height: '100%', zIndex: 100 }}>
        <AnimatePresence mode="wait">
          {(hovered || selected) ? (() => {
            const activeStand = hovered || selected;
            return (
            <motion.div
              key={activeStand.id}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="glass-panel"
              style={{
                height: '100%', padding: '0', display: 'flex', flexDirection: 'column', 
                background: 'rgba(10, 15, 25, 0.95)', border: `1px solid ${getOverlayData(activeStand).params.color}`,
                boxShadow: `0 0 50px rgba(0,0,0,0.9), inset 0 0 30px ${getOverlayData(activeStand).params.color}20`,
                overflow: 'hidden'
              }}
            >
               {/* Modal Header */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)' }}>
                 <div>
                   <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>{activeStand.name}</h3>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ISOLATED SECTOR TELEMETRY</span>
                 </div>
                 <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: '#fff', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>✕</button>
               </div>
               
               <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                  
                  {/* Saturation Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div style={{ background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${getOverlayData(activeStand).params.color}` }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>CROWD SATURATION</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: getOverlayData(activeStand).params.color }}>
                          {Math.round((activeStand.occupancy/activeStand.capacity)*100)}%
                        </div>
                     </div>
                     <div style={{ background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--accent-blue)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>HEADCOUNT LOG</div>
                        <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>{activeStand.occupancy.toLocaleString()}</div>
                     </div>
                  </div>

                  {/* AI Reasoning Module */}
                  {getOverlayData(activeStand).alert ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(239, 68, 68, 0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.4)', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent-red)' }}></div>
                       
                       <div style={{ display: 'flex', gap: '8px', color: 'var(--accent-red)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                         <ShieldAlert size={16} /> CRITICAL INSIGHT DIRECTIVE
                       </div>

                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, minWidth: '60px' }}>[CAUSE]</div>
                            <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{getOverlayData(activeStand).alert.cause}</div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ color: 'var(--accent-yellow)', fontSize: '0.75rem', fontWeight: 700, minWidth: '60px' }}>[EFFECT]</div>
                            <div style={{ color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 500 }}>
                               <ArrowRight size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', marginTop: '-2px' }} />
                               {getOverlayData(activeStand).alert.effect}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', marginTop: '8px' }}>
                            <div style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 700, minWidth: '60px' }}>[REC]</div>
                            <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 }}>
                               {getOverlayData(activeStand).alert.recommendation}
                            </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                       <ActivitySquare size={32} color="var(--accent-green)" style={{ marginBottom: '16px', opacity: 0.8 }} />
                       <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>System Nominal</span>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '4px' }}>No active artificial intelligence causal anomalies tracking for this structure.</span>
                    </div>
                  )}

               </div>
            </motion.div>
            );
            })()
          : (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-panel"
              style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', background: 'rgba(10, 15, 25, 0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
               <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Pavilion Overview</h3>
               <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px', display: 'block' }}>Network Topography Hard Counts</span>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                 {stands.map((stand) => {
                    const { risk, params } = getOverlayData(stand);
                    const saturation = (stand.occupancy/stand.capacity)*100;
                    return (
                      <div 
                        key={`list-${stand.id}`} 
                        onClick={() => setSelected(stand)}
                        style={{ cursor: 'pointer', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', borderLeft: `4px solid ${params.color}`, transition: '0.2s', transform: hovered?.id === stand.id ? 'translateX(5px)' : 'none' }}
                      >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{stand.name}</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: params.color }}>{saturation.toFixed(0)}%</div>
                         </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Hard Count: <strong style={{ color: '#fff' }}>{stand.occupancy.toLocaleString()}</strong></span>
                            <span>Cap: {stand.capacity.toLocaleString()}</span>
                         </div>
                      </div>
                    );
                 })}
               </div>
               
               <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click any architectural sector on the map or list to isolate subsystem intelligence.</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: mousePos.x + 15,
              top: mousePos.y + 15,
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${getOverlayData(hovered).params.color}`,
              padding: '16px',
              borderRadius: '8px',
              zIndex: 9999,
              pointerEvents: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              minWidth: '240px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
              {hovered.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Occupancy:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{hovered.occupancy.toLocaleString()} / {hovered.capacity.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Risk Level:</span>
              <span style={{ color: getOverlayData(hovered).params.color, fontWeight: 800 }}>{Math.round((hovered.occupancy/hovered.capacity)*100)}%</span>
            </div>
            
            <div style={{ 
               background: getOverlayData(hovered).alert ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.1)', 
               border: `1px solid ${getOverlayData(hovered).alert ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.2)'}`,
               padding: '10px', borderRadius: '6px', fontSize: '0.8rem' 
            }}>
               <div style={{ fontWeight: 700, color: getOverlayData(hovered).alert ? 'var(--accent-red)' : 'var(--accent-blue)', marginBottom: '4px' }}>AI Prediction</div>
               <div style={{ color: '#fff', lineHeight: 1.4 }}>
                 {getOverlayData(hovered).alert ? getOverlayData(hovered).alert.effect : 'Nominal flow expected. No impending bottlenecks detected.'}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}