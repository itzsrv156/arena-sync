/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState, useRef } from 'react';
import { Cpu, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AILogger({ aiAnalysis, enginePhase }) {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let newLogs = [];

    if (aiAnalysis?.alerts?.length > 0) {
      aiAnalysis.alerts.forEach(a => newLogs.push(`[${timestamp}] [ALERT] ${a.message}`));
    }
    if (aiAnalysis?.recommendations?.length > 0) {
      aiAnalysis.recommendations.forEach(r => newLogs.push(`[${timestamp}] [PREDICTIVE ACTION] ${r.action}`));
    }
    if (newLogs.length === 0) {
      newLogs.push(`[${timestamp}] [SYSTEM] Target phase lock: ${enginePhase.toUpperCase()}...`);
      if (Math.random() > 0.6) newLogs.push(`[${timestamp}] [SYSTEM] Vector paths nominal.`);
    }

    setLogs(prev => {
      const merged = [...prev, ...newLogs];
      return merged.slice(-15);
    });
  }, [aiAnalysis, enginePhase]);

  useEffect(() => {
    if (isExpanded && endRef.current && endRef.current.parentElement) {
      const parent = endRef.current.parentElement;
      parent.scrollTop = parent.scrollHeight;
    }
  }, [logs, isExpanded]);

  return (
    <motion.div 
      layout
      className="glass-panel" 
      initial={false}
      animate={{ 
        width: isExpanded ? 350 : 200, 
        height: isExpanded ? 200 : 48,
        borderRadius: isExpanded ? 16 : 24
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ 
        display: 'flex', flexDirection: 'column', 
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}
    >
      <motion.div layout style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: isExpanded ? 'transparent' : 'rgba(0,0,0,0.4)', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Cpu size={16} color="var(--accent-blue)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            Neural Feed {logs.length > 0 && !isExpanded && <span style={{ color: 'var(--accent-green)', marginLeft: '4px' }}>• ACT</span>}
          </span>
        </div>
        <div>
          {isExpanded ? <Minimize2 size={14} color="var(--text-secondary)" /> : <Maximize2 size={14} color="var(--text-secondary)" />}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ 
              flex: 1, background: 'rgba(0,0,0,0.6)', 
              margin: '0 12px 12px 12px', borderRadius: '8px', padding: '0.75rem', 
              overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.7rem', color: '#34d399',
              display: 'flex', flexDirection: 'column', gap: '4px',
              scrollbarWidth: 'none', msOverflowStyle: 'none'
            }}
          >
            {logs.map((log, i) => (
              <motion.div 
                key={i + log}
                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                style={{ color: log.includes('[ALERT]') ? '#ef4444' : log.includes('[PREDICTIVE ACTION]') ? '#facc15' : 'var(--text-secondary)', lineHeight: 1.4 }}
              >
                {log}
              </motion.div>
            ))}
            <div ref={endRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
