 
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Zap, Sparkles, CheckCircle, Activity, ChevronDown } from 'lucide-react';

export default function AiInsightsPage() {
  const { aiAnalysis, matchClockState } = useOutletContext();
  const [expandedRecId, setExpandedRecId] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={28} color="var(--accent-purple)" />
          Neural Engine Interlink
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep computational models evaluating vector velocity and localized spatial limits.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) minmax(300px, 1fr)', gap: '2rem', flex: 1 }}>
        <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '400px' }}>
           <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-yellow)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              <Activity size={16} /> Live Proxies Detected
           </h3>
           
           <AnimatePresence>
             {aiAnalysis.recommendations?.map(rec => {
               const isExpanded = expandedRecId === rec.id;
               
               return (
                 <motion.div 
                   key={rec.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   onMouseEnter={() => setExpandedRecId(rec.id)}
                   onMouseLeave={() => setExpandedRecId(null)}
                   style={{ 
                     background: 'rgba(168, 85, 247, 0.05)', 
                     border: isExpanded ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(168, 85, 247, 0.1)', 
                     padding: '1.5rem', 
                     borderRadius: '12px',
                     cursor: 'pointer',
                     transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                 >


                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ color: 'var(--accent-purple)', marginBottom: '8px', fontSize: '1.05rem', fontWeight: 600 }}>{rec.action}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
                         <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 700, fontFamily: 'monospace' }}>CF: {rec.confidenceScore}%</span>
                         <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} color="var(--text-secondary)" />
                      </div>
                    </div>
                    
                    <p style={{ fontSize: '0.85rem', color: '#fff', lineHeight: 1.5, marginBottom: isExpanded ? '1rem' : 0 }}>
                      {rec.detail}
                    </p>

                    <AnimatePresence mode="sync">
                      {isExpanded && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           style={{ overflow: 'hidden' }}
                         >
                            <div style={{ 
                               marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)',
                               display: 'flex', flexDirection: 'column', gap: '8px'
                            }}>
                               <span style={{ color: 'var(--accent-blue)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[System Vector Analysis]</span>
                               <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.6, fontFamily: 'monospace' }}>
                                  {rec.technicalReasoning || "Insufficient deep telemetry cache to render explanation."}
                               </span>
                            </div>
                         </motion.div>
                      )}
                    </AnimatePresence>
                 </motion.div>
               )
             })}
           </AnimatePresence>

           {(!aiAnalysis.recommendations || aiAnalysis.recommendations.length === 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', gap: '12px' }}>
                <CheckCircle size={32} color="var(--accent-green)" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deep metrics array is stabilized. No localized spatial limits breached.</span>
              </div>
           )}
        </motion.div>

        {/* Dynamic Neural State Node */}
        <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
           
           {/* Flowing binary / tech overlay logic */}
           <motion.div 
             animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
             transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
             style={{ 
               position: 'absolute', top: 0, left: 0, width: '200%', height: '200%',
               backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.1) 2px, transparent 2px)', 
               backgroundSize: '30px 30px', opacity: 0.3, zIndex: 0 
           }} />

           <div style={{ textAlign: 'center', maxWidth: '400px', zIndex: 1, position: 'relative' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem auto' }}>
                  {/* Rotating scanner ring */}
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', border: '2px dashed var(--accent-blue)', opacity: 0.5 }}
                  />
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    style={{ position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%', borderRadius: '50%', border: '1px solid var(--accent-purple)', opacity: 0.3 }}
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={36} color="var(--accent-blue)" />
                  </div>
              </div>
              
              <h2 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.4rem' }}>Matrix Active Mode</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.85rem' }}>
                 Tensors evaluate movement vectors and capacity ratios across 15+ stadium node boundaries actively mapped to the {matchClockState}ms chronological tick boundary.
              </p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
