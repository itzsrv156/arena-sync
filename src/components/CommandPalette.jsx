import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [executing, setExecuting] = useState(false);

  // Global escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands = [
    { id: 1, name: 'Deploy VIP Security Escort', icon: ShieldAlert, category: 'Security' },
    { id: 2, name: 'Force Ingress Reroute -> Gate 3', icon: Zap, category: 'Routing' },
    { id: 3, name: 'Activate Perimeter Lockdown', icon: ShieldAlert, category: 'Security', color: 'var(--accent-red)' },
    { id: 4, name: 'Purge Neural Cache Data', icon: Cpu, category: 'System' },
    { id: 5, name: 'Engage Concourse Backup Power', icon: Zap, category: 'Infrastructure' }
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  const handleCommandRun = (cmd) => {
    setExecuting(cmd.name);
    setTimeout(() => {
      setExecuting(false);
      onClose();
      // Wait for layout to trigger toast or something, for now just close
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div style={{
       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
       display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh'
    }}>
      {/* Heavy Blur Backdrop */}
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         transition={{ duration: 0.2 }}
         onClick={onClose}
         style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 5, 20, 0.7)', backdropFilter: 'blur(20px)' }}
      />
      
      <motion.div 
         initial={{ opacity: 0, y: -20, scale: 0.95 }} 
         animate={{ opacity: 1, y: 0, scale: 1 }} 
         exit={{ opacity: 0, y: -20, scale: 0.95 }}
         transition={{ type: 'spring', stiffness: 400, damping: 30 }}
         style={{
            position: 'relative', width: '90%', maxWidth: '650px', background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(168, 85, 247, 0.2)'
         }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
           <Terminal size={20} color="var(--accent-purple)" style={{ marginRight: '16px' }} />
           <input 
              autoFocus
              placeholder="Execute Neural Override..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={executing}
              style={{
                 flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem',
                 outline: 'none', fontFamily: 'monospace'
              }}
           />
           <div style={{ fontSize: '0.7rem', border: '1px solid var(--border-glass)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>ESC</div>
        </div>

        <div style={{ padding: '8px', maxHeight: '350px', overflowY: 'auto' }}>
           <AnimatePresence>
             {executing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px', textAlign: 'center', color: 'var(--accent-green)' }}>
                   <div style={{ marginBottom: '10px' }}><Zap size={30} className="spinner-glow" /></div>
                   <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>OVERRIDE ACCEPTED: {executing}</div>
                </motion.div>
             ) : (
                filteredCommands.map((cmd) => (
                   <motion.div 
                     layout
                     key={cmd.id}
                     onClick={() => handleCommandRun(cmd)}
                     whileHover={{ background: 'rgba(168, 85, 247, 0.15)', x: 4 }}
                     style={{
                        padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '16px', margin: '4px 0',
                        borderLeft: `3px solid transparent`
                     }}
                   >
                     <cmd.icon size={18} color={cmd.color || "var(--text-secondary)"} />
                     <div style={{ flex: 1, color: '#fff', fontSize: '0.95rem' }}>{cmd.name}</div>
                     <div style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                        {cmd.category}
                     </div>
                   </motion.div>
                ))
             )}
             {filteredCommands.length === 0 && !executing && (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                   No matching sub-routines found.
                </div>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
