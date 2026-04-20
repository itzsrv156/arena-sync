import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, ArrowRightLeft, Route, CheckCircle2 } from 'lucide-react';
import { ComposedChart, Line, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import TemporalSlider from '../components/TemporalSlider';
import SecurityFeed from '../components/SecurityFeed';
import ArrivalsFunnel from '../components/ArrivalsFunnel';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="glass-panel glass-panel-hover"
    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '10px', borderRadius: '12px', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
        <Icon size={24} />
      </div>
    </div>
    <div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{value}</div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const { stadiumData, aiAnalysis, history, currentMatch } = useOutletContext();
  const [routeRevealed, setRouteRevealed] = useState(false);
  const [forecastOffset, setForecastOffset] = useState(0);

  const getMultiplier = () => {
    if (forecastOffset === 0) return 1;
    if (forecastOffset === 1) return 1.5;
    return 2.5; 
  };
  const mtp = getMultiplier();

  // Scale data for Predictive Forecasting
  const avgQueueRaw = stadiumData.facilities.foodStalls.reduce((acc, f) => acc + f.queueWaitTimeMin, 0) / stadiumData.facilities.foodStalls.length;
  const avgQueue = avgQueueRaw * mtp;

  const activeAttendance = Math.min(stadiumData.overallCapacity, stadiumData.currentAttendance * mtp);
  
  // Calculate percentage against Expected Attendance based on bookings
  const maxBookingCapacity = Math.floor(stadiumData.overallCapacity * (currentMatch.bookingPercentage / 100));
  const fillPercentage = ((activeAttendance / maxBookingCapacity) * 100).toFixed(1);

  // Generate complex synthetic multi-series data based on history for the Oscilloscope chart
  const oscilloscopeData = history.length > 0 
    ? history.map((snap, i) => {
        const capacityLimit = Math.floor(snap.overallCapacity * (currentMatch.bookingPercentage / 100));
        // Only scale the final dot realistically, or whole chart if we want. For now, simulating whole chart spike.
        return {
          time: i, 
          actualVolume: Math.min(snap.overallCapacity, snap.currentAttendance * mtp),
          tensionLimit: capacityLimit * 0.85, // 85% Warning threshold curve
          maxCapacity: capacityLimit
        }
      })
    : [{ time: 0, actualVolume: activeAttendance, tensionLimit: maxBookingCapacity * 0.85, maxCapacity: maxBookingCapacity }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Arena Sync Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring structural telemetry for {stadiumData.name} • {currentMatch.homeTeam} vs {currentMatch.awayTeam}</p>
        </div>
        <div style={{ flex: 1, minWidth: '280px' }}>
           <TemporalSlider value={forecastOffset} onChange={setForecastOffset} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Total Scans" value={Math.floor(activeAttendance).toLocaleString()} icon={Users} color="56, 189, 248" />
        <StatCard title="Target Ratio" value={`${fillPercentage}%`} icon={CheckCircle2} color="250, 204, 21" />
        <StatCard title="Avg Concourse Delay" value={`${avgQueue.toFixed(1)} min`} icon={Clock} color="168, 85, 247" />
        <StatCard title="Active Incidents" value={aiAnalysis.alerts?.length || 0} icon={ArrowRightLeft} color="239, 68, 68" />
      </div>

      <div className="mobile-grid-stack mobile-auto-height" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', height: '500px' }}>
        
        <motion.div className="glass-panel mobile-auto-height mobile-padding" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Oscilloscope: Volume vs Constraint</h3>
          <div style={{ flex: 1, minHeight: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={oscilloscopeData} margin={{ top: 10, right: 0, left: 10, bottom: 0 }}>
                <defs>
                  <filter id="neonBlue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="neonRed" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} contentStyle={{ background: '#000', border: '1px solid var(--border-glass)', borderRadius: '8px' }} />
                
                <Area type="step" dataKey="maxCapacity" stroke="none" fill="rgba(255,255,255,0.02)" isAnimationActive={false} />
                <Line type="monotone" dataKey="tensionLimit" stroke="var(--accent-red)" strokeWidth={2} strokeDasharray="5 5" filter="url(#neonRed)" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="actualVolume" stroke="var(--accent-blue)" strokeWidth={4} filter="url(#neonBlue)" dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '8px' }}>
          
          {/* INGRESS FUNNEL REPLACING THE ROUTE FINDER */}
          <ArrivalsFunnel currentAttendance={activeAttendance} maxCapacity={maxBookingCapacity} />

          <motion.div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Live Concession Telemetry</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stadiumData.facilities.foodStalls.map((stall, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                   <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{stall.name}</div>
                   <div style={{ 
                      fontSize: '0.85rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                      background: stall.queueWaitTimeMin * mtp > 18 ? 'rgba(239, 68, 68, 0.2)' : stall.queueWaitTimeMin * mtp > 8 ? 'rgba(250, 204, 21, 0.2)' : 'rgba(74, 222, 128, 0.1)',
                      color: stall.queueWaitTimeMin * mtp > 18 ? 'var(--accent-red)' : stall.queueWaitTimeMin * mtp > 8 ? 'var(--accent-yellow)' : 'var(--accent-green)'
                   }}>
                      {Math.floor(stall.queueWaitTimeMin * mtp)} min wait
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* SECURE BIOMETRIC FEED */}
          <SecurityFeed />

        </div>

      </div>
    </div>
  );
}
