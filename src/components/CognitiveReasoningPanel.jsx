import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, AlertTriangle, ArrowRight, ActivitySquare, Terminal } from 'lucide-react';

export default function CognitiveReasoningPanel({ aiAnalysis }) {
  const alerts = aiAnalysis?.alerts || [];

  return (
    <motion.div 
      className="glass-panel mobile-auto-height" 
      style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(0,0,0,0.9))',
        borderLeft: '4px solid var(--accent-purple)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <BrainCircuit size={18} color="var(--accent-purple)" />
          Cognitive Intelligence Matrix
        </h3>
        {alerts.length > 0 && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 1.5s infinite' }}></div>
             <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', letterSpacing: '0.05em' }}>ACTIVE DIRECTIVES ({alerts.length})</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '8px' }}>
        <AnimatePresence mode="popLayout">
          {alerts.length > 0 ? alerts.map((alert, idx) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: `1px solid ${alert.level === 'critical' ? 'rgba(239,68,68,0.3)' : 'rgba(250,204,21,0.3)'}`,
                borderRadius: '12px',
                padding: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle background glow */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: alert.level === 'critical' ? 'var(--accent-red)' : 'var(--accent-yellow)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Terminal size={14} color="var(--text-secondary)" />
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>SYS_REASONING_CHAIN // {alert.source}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Cause */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                   <div style={{ minWidth: '60px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, paddingTop: '3px' }}>[CAUSE]</div>
                   <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{alert.cause}</div>
                </div>
                
                {/* Effect */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                   <div style={{ minWidth: '60px', fontSize: '0.7rem', color: 'var(--accent-yellow)', fontWeight: 600, paddingTop: '3px' }}>[EFFECT]</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--accent-yellow)', fontWeight: 500 }}>
                     <ArrowRight size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                     {alert.effect}
                   </div>
                </div>

                {/* Recommendation */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(56, 189, 248, 0.05)', padding: '8px', borderRadius: '8px', borderLeft: '2px solid var(--accent-blue)', marginTop: '4px' }}>
                   <div style={{ minWidth: '60px', fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600, paddingTop: '3px' }}>[REC]</div>
                   <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{alert.recommendation}</div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', opacity: 0.5 }}>
               <ActivitySquare size={32} color="var(--accent-green)" />
               <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>System Nominal. Zero causal anomalies detected.</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
