import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DemographicsChart({ attendance }) {
  // Generate realistic-looking demographic distribution based on total attendance
  const data = [
    { name: 'Core Fanatics', value: Math.floor(attendance * 0.45) },
    { name: 'Families', value: Math.floor(attendance * 0.25) },
    { name: 'Corporate/VIP', value: Math.floor(attendance * 0.10) },
    { name: 'Casual Observers', value: Math.floor(attendance * 0.20) }
  ];

  const COLORS = ['#38bdf8', '#a855f7', '#facc15', '#4ade80'];

  return (
    <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
       <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Active Demographic Segmentation
       </h3>
       
       <div style={{ flex: 1, minHeight: '200px' }}>
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             <defs>
                <filter id="pieGlow">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                   </feMerge>
                </filter>
             </defs>
             <Pie
               data={data}
               cx="50%"
               cy="50%"
               innerRadius="65%"
               outerRadius="85%"
               paddingAngle={5}
               dataKey="value"
               stroke="none"
             >
               {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} filter="url(#pieGlow)" style={{ outline: 'none' }} />
               ))}
             </Pie>
             <Tooltip 
                contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontWeight: 600 }}
             />
             <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '0.85rem' }} />
           </PieChart>
         </ResponsiveContainer>
       </div>
    </div>
  );
}
