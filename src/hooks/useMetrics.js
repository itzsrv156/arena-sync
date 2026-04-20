import { useState, useEffect } from 'react';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState({ crowdCount: 0, activeZones: 0 });

  useEffect(() => {
    // Placeholder fetching logic
    setMetrics({ crowdCount: 45000, activeZones: 12 });
  }, []);

  return metrics;
};
