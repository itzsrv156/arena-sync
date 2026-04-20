import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, BarChart3, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dash', path: '/', icon: LayoutDashboard },
  { name: 'Live Map', path: '/map', icon: MapIcon },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'AI', path: '/insights', icon: BrainCircuit },
];

export default function MobileNav() {
  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.6)',
        display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',
        padding: '0.75rem 0.5rem 1.5rem 0.5rem', // Padding for iOS home bar safety
        zIndex: 9999
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            color: isActive ? '#fff' : 'var(--text-secondary)',
            textDecoration: 'none', WebkitTapHighlightColor: 'transparent',
            padding: '8px 12px', borderRadius: '12px',
            background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
            transition: 'all 0.2s ease'
          })}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} color={isActive ? 'var(--accent-purple)' : 'currentColor'} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </motion.div>
  );
}
