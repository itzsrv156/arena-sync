 
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LocateFixed } from 'lucide-react';

export default function ArrivalsFunnel({ currentAttendance, maxCapacity }) {
  // Simulate the conversion pipeline based on active attendance
  // To make it look like a funnel, the numbers decrease as they get closer to the seat
  // Transport Hub -> Security Perimeter -> Concourse -> In-Seat
  
  // The earlier in the pipeline, the more people are mapped to those areas
  const transportHub = Math.floor(currentAttendance * 1.5 + 2000); // Backlog of people arriving
  const perimeter = Math.floor(currentAttendance * 1.2 + 800);
  const concourse = Math.floor(currentAttendance * 1.05 + 300);
  const seated = currentAttendance;

  const data = [
    { name: 'Transport', volume: transportHub },
    { name: 'Security', volume: perimeter },
    { name: 'Concourse', volume: concourse },
    { name: 'Seated', volume: seated },
  ];

  const getBarColor = (index, volume) => {
     if (index === 0) return '#38bdf8'; // Blue
     if (index === 1) return volume > maxCapacity * 0.9 ? '#ef4444' : '#a855f7'; // Red if backlog
     if (index === 2) return '#facc15'; // Yellow
     return '#4ade80'; // Green
  };

  return (
    <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
       <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
         <LocateFixed size={18} color="var(--accent-blue)" /> Ingress Pipeline Funnel
       </h3>

       <div style={{ flex: 1, minHeight: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
               <XAxis type="number" hide />
               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={70} />
               <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-glass)', borderRadius: '8px' }} 
                  formatter={(value) => [value.toLocaleString(), 'Fans']}
               />
               <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500}>
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={getBarColor(index, entry.volume)} />
                 ))}
               </Bar>
             </BarChart>
          </ResponsiveContainer>
       </div>
    </motion.div>
  );
}
