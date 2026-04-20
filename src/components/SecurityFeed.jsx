import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, AlertOctagon, CheckCircle2 } from 'lucide-react';

const MESSAGES = [
  { type: 'scan', text: 'Permit Scan [A-44]: Sector C (Clear)' },
  { type: 'scan', text: 'Facial Match: Reg VIP [G-3]' },
  { type: 'alert', text: 'ANOMALY: High Thermal Density [North Stand]' },
  { type: 'scan', text: 'Permit Scan [B-12]: Sector E (Clear)' },
  { type: 'system', text: 'Neural Engine Node synced to Core.' },
  { type: 'alert', text: 'WARNING: Perimeter tension increasing (Gate 1)' },
  { type: 'scan', text: 'Facial Match: Operator Level 3' },
  { type: 'system', text: 'Re-evaluating spatial telemetry arrays...' }
];

export default function SecurityFeed() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      const isRandomSpike = Math.random() > 0.8;
      if (isRandomSpike) {
         const newMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
         setLogs(prev => {
            const up = [{ id: Date.now() + Math.random(), ...newMsg }, ...prev];
            if (up.length > 5) up.pop();
            return up;
         });
      }
      count++;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', display: 'flex', flexDirection: 'column',
      background: 'rgba(5, 10, 15, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)'
    }}>
      <h3 style={{ 
         fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', 
         color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' 
      }}>
        <Fingerprint size={16} /> Live Data Stream
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '200px', overflow: 'hidden' }}>
        <AnimatePresence>
           {logs.map((log) => (
             <motion.div 
               layout
               key={log.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  fontFamily: 'monospace', fontSize: '0.8rem', padding: '6px', borderRadius: '4px',
                  background: log.type === 'alert' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                  borderLeft: log.type === 'alert' ? '2px solid var(--accent-red)' : '2px solid transparent'
               }}
             >
               {log.type === 'alert' ? (
                  <AlertOctagon size={14} color="var(--accent-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
               ) : (
                  <CheckCircle2 size={14} color="var(--accent-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
               )}
               <span style={{ 
                  color: log.type === 'alert' ? 'var(--accent-red)' : 'var(--text-secondary)' 
               }}>
                  [{new Date().toISOString().substring(11,19)}] {log.text}
               </span>
             </motion.div>
           ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
           <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
             Initializing Secure Comm...
           </div>
        )}
      </div>
      
      <div style={{ 
         marginTop: 'auto', paddingTop: '10px', borderTop: '1px dotted var(--border-glass)',
         display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
         <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontFamily: 'monospace' }}>PING: 4ms</span>
         <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Operator Terminal Active</span>
      </div>
    </div>
  );
}
