import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Volume2, Smile, AlertTriangle } from 'lucide-react';

export default function CrowdPulseWidget({ avgQueueTime }) {
  const [decibels, setDecibels] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
       // fluctuate dB level 
       setDecibels(prev => Math.max(60, Math.min(120, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Determine sentiment based on wait times
  let sentimentStr = "Highly Positive / Excited";
  let sentimentColor = "var(--accent-green)";
  let Icon = Smile;

  if (avgQueueTime > 15) {
     sentimentStr = "Frustrated / Restless";
     sentimentColor = "var(--accent-red)";
     Icon = AlertTriangle;
  } else if (avgQueueTime > 8) {
     sentimentStr = "Anxious / Awaiting";
     sentimentColor = "var(--accent-yellow)";
     Icon = Activity;
  }

  // Calculate percentage for progress bar (max 130dB)
  const dbVisualPCT = (decibels / 130) * 100;

  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
       <h3 style={{ marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Acoustic & Sentiment Matrix
       </h3>

       <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          
          {/* Decibel Meter */}
          <div style={{ flex: 1 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#fff', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Volume2 size={16} color="var(--accent-blue)" /> Crowd Roar (dB)</span>
                <span>{Math.round(decibels)} dB</span>
             </div>
             <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                <motion.div 
                   animate={{ width: `${dbVisualPCT}%` }}
                   transition={{ type: 'spring', bounce: 0.5 }}
                   style={{ 
                      height: '100%', 
                      background: decibels > 100 ? 'var(--accent-red)' : decibels > 85 ? 'var(--accent-yellow)' : 'var(--accent-blue)',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                   }}
                />
             </div>
             <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span>60 (Calm)</span>
                <span>90 (Loud)</span>
                <span>130 (Danger)</span>
             </div>
          </div>

          <div style={{ width: '1px', background: 'var(--border-glass)', alignSelf: 'stretch' }}></div>

          {/* Sentiment Status */}
          <div style={{ flex: 1 }}>
             <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Social & Behavioral Sentiment
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '50%', background: `rgba(${sentimentColor === 'var(--accent-red)' ? '239,68,68' : sentimentColor === 'var(--accent-yellow)' ? '250,204,21' : '74,222,128'}, 0.15)` }}>
                   <Icon size={24} color={sentimentColor} />
                </div>
                <div>
                   <div style={{ color: sentimentColor, fontWeight: 700, fontSize: '1.1rem' }}>{sentimentStr}</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Primary Trigger: {avgQueueTime > 8 ? 'Concourse Congestion' : 'Match Excitement'}
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
