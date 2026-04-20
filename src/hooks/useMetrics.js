import { useState, useEffect } from 'react';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({ crowdCount: 0, activeZones: 0 });

  useEffect(() => {
    // Placeholder fetching logic
    const timer = setTimeout(() => {
      setMetrics({ crowdCount: 45000, activeZones: 12 });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return metrics;
};
