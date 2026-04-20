import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ComposedChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Bar, Line, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Scatter, ScatterChart 
} from 'recharts';
import { Activity, RadioTower } from 'lucide-react';
import CrowdPulseWidget from '../components/CrowdPulseWidget';
import DemographicsChart from '../components/DemographicsChart';

export default function AnalyticsPage() {
  const { stadiumData, currentMatch } = useOutletContext();

  // Spatial Radar Data
  const radarData = stadiumData.stands.map(s => {
    let risk = (s.occupancy / s.capacity) * 100;
    return {
      subject: s.name.substring(0, 15),
      A: risk.toFixed(1), // Actual Risk Limit
      fullMark: 100
    }
  });

  // Calculate generic avg queue time for the pulse widget
  const avgQueue = stadiumData.facilities.foodStalls.reduce((acc, f) => acc + f.queueWaitTimeMin, 0) / stadiumData.facilities.foodStalls.length;

  // Composed Matrix: Shows actual capacity bars overlaid with trajectory line mapping
  const composedData = stadiumData.stands.map(s => {
    return {
      name: s.name.substring(0, 8),
      occupancy: s.occupancy,
      capacity: s.capacity,
      trajectory: Math.round(s.occupancy * 1.15) // A fake "predicted" future state line
    }
  });

  // Scatter Flow Anomalies
  // We'll generate random throughput distributions across gates to simulate an anomaly heat plot.
  const scatterData = stadiumData.gates.map((g, i) => {
    return {
       node: g.name.substring(0, 8),
       throughput: g.currentLoadPerMinute,
       stressIndex: g.currentLoadPerMinute / g.capacityPerMinute * 100,
       id: i
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RadioTower size={28} color="var(--accent-red)" />
          Broadcast Data Matrix
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Live engineering analytics mapping spatial limits and temporal trajectories.</p>
      </div>

      <div className="mobile-grid-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* TOP ROW */}
        <CrowdPulseWidget avgQueueTime={avgQueue} />
        <DemographicsChart attendance={stadiumData.currentAttendance} />

        {/* SPATIAL RADAR CHART */}
        <motion.div className="glass-panel" style={{ padding: '2rem', height: '400px', borderTop: '3px solid var(--accent-purple)' }}>
          <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Spatial Quadrant Density Map</h3>
          <ResponsiveContainer width="100%" height="90%">
             <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <defs>
                   <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="3" result="blur" />
                     <feMerge>
                       <feMergeNode in="blur" />
                       <feMergeNode in="SourceGraphic" />
                     </feMerge>
                   </filter>
                </defs>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glass)' }} />
                <Radar name="Density Limit" dataKey="A" stroke="var(--accent-purple)" fill="var(--accent-purple)" fillOpacity={0.3} filter="url(#radarGlow)" />
             </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* SCATTER ANOMALY DETECTOR */}
        <motion.div className="glass-panel" style={{ padding: '2rem', height: '400px', borderTop: '3px solid var(--accent-yellow)' }}>
          <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Throughput Anomaly Scatter</h3>
          <ResponsiveContainer width="100%" height="90%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
               <XAxis type="category" dataKey="node" name="Gate" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
               <YAxis type="number" dataKey="stressIndex" name="Stress %" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
               <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glass)' }} />
               <Scatter name="Gate Stress" data={scatterData} fill="var(--accent-yellow)" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* FULL WIDTH COMPOSED TRAJECTORY CHART */}
        <motion.div className="glass-panel" style={{ padding: '2rem', height: '400px', gridColumn: '1 / -1', borderTop: '3px solid var(--accent-blue)' }}>
          <h3 style={{ marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Volumetric Matrix: Actual vs Projected Capacity</h3>
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={composedData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <defs>
                 <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="4" result="blur" />
                   <feMerge>
                     <feMergeNode in="blur" />
                     <feMergeNode in="SourceGraphic" />
                   </feMerge>
                 </filter>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0.2}/>
                 </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--border-glass)' }} />
              
              <Area type="monotone" dataKey="capacity" fill="rgba(255,255,255,0.05)" stroke="none" />
              <Bar dataKey="occupancy" barSize={40} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="trajectory" stroke="#fff" strokeWidth={3} filter="url(#lineGlow)" activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
