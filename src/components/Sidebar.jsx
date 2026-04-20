import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, BarChart3, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from '../assets/logo.png';

const Sidebar = ({ aiAnalysis, isHovered, setIsHovered }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Map', path: '/map', icon: MapIcon },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Insights', path: '/insights', icon: BrainCircuit },
  ];

  return (
    <motion.div 
      className="glass-panel" 
      initial={false}
      animate={{ width: isHovered ? 260 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: 'calc(100vh - 2rem)',
        position: 'fixed',
        left: '0.5rem',
        top: '1rem',
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 100, // Ensure it's above normal content but below modals
        boxShadow: isHovered ? '0 10px 50px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '3rem', whiteSpace: 'nowrap' }}>
        <div style={{
          minWidth: '40px', height: '40px', borderRadius: '10px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)',
          overflow: 'hidden', background: '#000'
        }}>
          <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', fontWeight: 800, margin: 0, background: 'linear-gradient(90deg, #38bdf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Arena Sync
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 10px',
              borderRadius: '12px',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              whiteSpace: 'nowrap'
            })}
          >
             <div style={{ minWidth: '24px', display: 'flex', justifyContent: 'center' }}>
               <item.icon size={22} style={{ opacity: 0.9 }} />
             </div>
             <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.name}
                  </motion.span>
                )}
             </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', whiteSpace: 'nowrap' }}>
         <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(!aiAnalysis || !aiAnalysis.alerts || aiAnalysis.alerts.length === 0) ? (
              <>
                <div style={{ minWidth: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 10px var(--accent-green)' }}></div>
                <AnimatePresence>
                  {isHovered && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>System</span>
                       <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>Nominal</span>
                     </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <div style={{ 
                   minWidth: '10px', height: '10px', borderRadius: '50%', 
                   background: aiAnalysis.alerts.some(a => a.level === 'critical') ? 'var(--accent-red)' : 'var(--accent-yellow)',
                   boxShadow: `0 0 10px ${aiAnalysis.alerts.some(a => a.level === 'critical') ? 'var(--accent-red)' : 'var(--accent-yellow)'}`,
                   animation: 'pulse 2s infinite'
                }}></div>
                <AnimatePresence>
                  {isHovered && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</span>
                       <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                          {aiAnalysis.alerts.some(a => a.level === 'critical') ? 'CRITICAL' : 'WARNING'}
                       </span>
                     </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
         </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
