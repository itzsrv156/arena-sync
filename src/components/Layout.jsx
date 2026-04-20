import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useDigitalTwin } from '../hooks/useDigitalTwin';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { CloudRain, Cloud, Sun, ServerCrash, FastForward, Activity, Navigation, User, Settings, LogOut, ShieldCheck, Info, Terminal } from 'lucide-react';
import AILogger from './AILogger';
import CommandPalette from './CommandPalette';
import MobileNav from './MobileNav';

export default function Layout() {
  const location = useLocation();
  const engineContext = useDigitalTwin(4000); 
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global hotkey for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { 
    envData, matchPhase, setMatchPhase, 
    fixturesData, currentMatchId, setCurrentMatchId,
    currentMatch, matchClockState, aiAnalysis, triggerMatchEvent, activeEvent
  } = engineContext;

  const simSeconds = matchClockState * 30;
  const matchMM = Math.floor(simSeconds / 60).toString().padStart(2, '0');
  const matchSS = (simSeconds % 60).toString().padStart(2, '0');

  const renderWeatherIcon = () => {
    if (envData.status === 'simulated') return <ServerCrash size={18} color="var(--accent-red)" />;
    if (envData.condition === 'rain' || envData.condition === 'storm') return <CloudRain size={18} color="var(--accent-blue)" />;
    if (envData.condition === 'snow') return <Cloud size={18} />;
    return <Sun size={18} color="var(--accent-yellow)" />;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      
      {/* Desktop Sidebar */
       !isMobile && <Sidebar aiAnalysis={aiAnalysis} isHovered={sidebarHovered} setIsHovered={setSidebarHovered} />
      }
      {/* Mobile Bottom Nav */
       isMobile && <MobileNav />
      }
      
      {/* Front page overlay when sidebar expands */}
      <AnimatePresence>
        {!isMobile && sidebarHovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 90, pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        style={{ 
          flex: 1, 
          marginLeft: isMobile ? 0 : 105,
          padding: isMobile ? '1rem 1rem 6rem 1rem' : '1rem 2rem 2rem 1rem', // Extra bot margin for mobile nav
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Global Control Bar (ArenaSync Broadcast Style) */}
        <header className="glass-panel" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            marginBottom: '2rem', 
            padding: '1rem 2rem',
            gap: '1rem',
            borderRadius: '16px',
            borderTop: '3px solid var(--accent-purple)'
          }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Host Sync
            </span>
            <select 
              value={currentMatchId} 
              onChange={e => setCurrentMatchId(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-glass)',
                padding: '6px 12px', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {fixturesData.map(m => (
                <option key={m.id} value={m.id} style={{ background: 'var(--bg-dark)' }}>
                  {m.homeTeam} vs {m.awayTeam}
                </option>
              ))}
            </select>
          </div>

          <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-dark)', padding: '6px 20px', borderRadius: '24px', border: '1px solid var(--border-glass)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
             <Activity size={16} color={activeEvent ? "var(--accent-red)" : "var(--accent-green)"} style={{ filter: activeEvent ? 'drop-shadow(0 0 8px var(--accent-red))' : 'none' }} />
             <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', color: '#fff' }}>
               {matchMM}:{matchSS}
             </div>
             <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(45deg, #facc15, #ef4444)' }}></div>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{currentMatch.homeTeam.substring(0,3).toUpperCase()}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem' }}>142/3</span>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(45deg, #38bdf8, #8b5cf6)' }}></div>
             </div>
          </div>

          <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Simulation Triggers */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Navigation size={14} color="var(--accent-yellow)" />
                 <span style={{ color: 'var(--accent-yellow)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                   Force Triggers
                 </span>
               </div>
               <div style={{ display: 'flex', gap: '8px', position: 'relative' }} className="tooltip-container">
                 <button 
                   onClick={() => triggerMatchEvent('wicket')}
                   style={{
                     padding: '4px 12px', borderRadius: '8px',
                     background: activeEvent === 'wicket' ? 'var(--accent-red)' : 'rgba(239, 68, 68, 0.1)',
                     color: activeEvent === 'wicket' ? '#fff' : 'var(--accent-red)',
                     border: '1px solid rgba(239, 68, 68, 0.3)',
                     fontSize: '0.75rem', fontWeight: 600, transition: '0.2s', cursor: 'pointer',
                     display: 'flex', alignItems: 'center', gap: '6px'
                   }}>
                   Drop Wicket <Info size={12}/>
                 </button>
                 <div className="tooltip-box" style={{ 
                    position: 'absolute', top: '100%', left: '0', marginTop: '10px', 
                    background: 'rgba(0,0,0,0.9)', border: '1px solid var(--accent-purple)', 
                    padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', 
                    width: '200px', pointerEvents: 'none', zIndex: 100
                 }}>
                   Causes fans to abandon stands and flood food/washroom queues for the next 6 simulation ticks.
                 </div>
               </div>
            </div>

            {/* Timelines */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FastForward size={14} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Force Timeline
                </span>
              </div>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                {["pre-match", "live", "break", "post-match"].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setMatchPhase(p)}
                    style={{
                      padding: '4px 12px', borderRadius: '8px', cursor: 'pointer',
                      background: matchPhase === p ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: matchPhase === p ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.75rem', fontWeight: matchPhase === p ? 600 : 400,
                      transition: 'all 0.2s', textTransform: 'capitalize', border: 'none'
                    }}
                  >
                    {p === 'live' ? 'Innings' : p.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--border-glass)' }}></div>

            {/* Weather Element */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '12px' }}>
               {renderWeatherIcon()}
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{envData.temperature}°C</span>
               </div>
            </div>

            {/* Admin Profile Cluster */}
            <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
              <div 
                 onClick={() => setIsCommandOpen(true)}
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '6px 12px', borderRadius: '16px' }}
              >
                 <Terminal size={14} color="var(--accent-purple)" />
                 <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)' }}>Cmd+K</span>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)', margin: '0 8px' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin Host</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Central Command Node</span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>
                <User size={20} color="var(--accent-blue)" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '6px' }}>
                <Settings size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={() => setIsSettingsOpen(true)} />
                <LogOut size={16} color="var(--text-secondary)" style={{ cursor: 'pointer' }} onClick={() => showToast('Terminating Secure Session... (Authorization Required)')} />
              </div>
            </div>

          </div>
        </header>

        <main style={{ flex: 1, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} 
              style={{ width: '100%', height: '100%' }}
            >
              <Outlet context={engineContext} />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* Floating System Toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="glass-panel"
            style={{
              position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)',
              padding: '12px 24px', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '12px',
              border: '1px solid var(--accent-purple)', background: 'rgba(0,0,0,0.8)'
            }}
          >
            <ShieldCheck size={18} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Override Tools & Modals */}
      <AnimatePresence>
        {isSettingsOpen && (
           <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 5000, display: 'flex', alignItems: 'center', justifyItems: 'center', pointerEvents: 'auto' }}>
              {/* Force Backdrop */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="glass-panel" style={{ background: 'var(--bg-dark)', width: '400px', margin: '0 auto', zIndex: 5001, padding: '2rem', borderRadius: '16px' }}>
                 <h2 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '12px' }}><Settings color="var(--accent-purple)"/> Host Configurations</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                      <div><div style={{ fontWeight: 600 }}>Neural Push Alerts</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send alerts to Operator radio</div></div>
                      <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--accent-purple)' }}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                      <div><div style={{ fontWeight: 600 }}>Simulation Engine Clock</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Adjust base tick speed</div></div>
                      <select style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-glass)', outline: 'none' }}>
                        <option>Realtime (1x)</option>
                        <option>Fast (2x)</option>
                        <option>Ludicrous (10x)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem' }}>
                      <div><div style={{ fontWeight: 600 }}>Biometric Facial Sync</div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cross-ref ticket databank</div></div>
                      <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--accent-purple)' }}/>
                    </div>
                 </div>
                 <button onClick={() => { setIsSettingsOpen(false); showToast("Saving host configurations into core DB..."); }} style={{ width: '100%', marginTop: '1.5rem', background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))', padding: '12px', color: '#fff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Apply Core Changes</button>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      <div className="mobile-hide" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
         <AILogger aiAnalysis={aiAnalysis} enginePhase={matchPhase} />
      </div>

    </div>
  );
}
