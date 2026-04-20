import React from 'react';
import { motion } from 'framer-motion';
import { FastForward, TriangleAlert } from 'lucide-react';

export default function TemporalSlider({ value, onChange }) {
  const getMultiplier = () => {
    if (value === 0) return 1;
    if (value === 1) return 1.5;
    return 2.5; // +30m
  };

  const getLabel = () => {
    if (value === 0) return "Live Sync";
    if (value === 1) return "+15m Prediction";
    return "+30m Prediction";
  };

  const mtp = getMultiplier();

  return (
    <div className="glass-panel" style={{ 
       padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
       background: value > 0 ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(0,0,0,0.5))' : 'var(--panel-bg)',
       border: value > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)',
       transition: 'all 0.5s ease', position: 'relative', overflow: 'hidden'
    }}>
      
      {value > 0 && (
         <motion.div 
           initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} 
           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)', pointerEvents: 'none' }} 
         />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
         <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: value > 0 ? 'var(--accent-red)' : '#fff' }}>
           {value > 0 ? <TriangleAlert size={18} className="pulse-glow" /> : <FastForward size={18} color="var(--accent-blue)" />}
           Temporal Forecaster
         </h3>
         <div style={{ 
            fontSize: '0.8rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', 
            background: value > 0 ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)'
         }}>
           {getLabel()}
         </div>
      </div>

      <div style={{ position: 'relative', height: '40px', display: 'flex', alignItems: 'center', zIndex: 1 }}>
         {/* Custom Track */}
         <div style={{ position: 'absolute', width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
            <div style={{ width: `${(value / 2) * 100}%`, height: '100%', background: value > 0 ? 'var(--accent-red)' : 'var(--accent-blue)', transition: 'width 0.3s ease' }}></div>
         </div>
         
         {/* Native Range Input Override */}
         <input 
            type="range" min="0" max="2" step="1" 
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ 
               width: '100%', position: 'absolute', zIndex: 2, top: '50%', transform: 'translateY(-50%)',
               appearance: 'none', background: 'transparent', cursor: 'pointer'
            }}
            className="temporal-slider"
         />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', zIndex: 1, fontFamily: 'monospace' }}>
         <span>T-0 Live Matrix</span>
         <span>T+15 Extrapolation</span>
         <span>T+30 Limit Push</span>
      </div>
    </div>
  );
}
