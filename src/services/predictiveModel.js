export const runAIAnalysis = (history, currentState) => {
  if (!history || history.length < 2) return { alerts: [], recommendations: [], riskScores: {} };

  const lastState = history[history.length - 2];
  const allAlerts = [];
  const riskScores = {};

  // Analyze Gates
  currentState.gates.forEach(gate => {
    const prevGate = lastState.gates.find(g => g.id === gate.id);
    if (!prevGate) return;

    const delta = gate.currentLoadPerMinute - prevGate.currentLoadPerMinute;
    const capacityRatio = gate.currentLoadPerMinute / gate.capacityPerMinute;
    
    let risk = capacityRatio * 100;
    const predictedLoad = gate.currentLoadPerMinute + (delta * 4);
    
    if (predictedLoad >= gate.capacityPerMinute && capacityRatio > 0.6 && delta > 0) {
      risk = Math.min(100, risk + 25);
      allAlerts.push({
        id: `gate-${gate.id}`,
        level: 'critical',
        source: gate.name,
        cause: `${gate.name} ingress saturation (${(capacityRatio * 100).toFixed(0)}%)`,
        effect: `Projected structural capacity failure in ${(Math.max(1, (gate.capacityPerMinute - gate.currentLoadPerMinute) / delta)).toFixed(0)} minutes`,
        recommendation: `Issue immediate suppression protocols locally to limit throughput. Vector 15% traffic to adjacent clear zones.`,
        urgency: risk
      });
    }
    riskScores[gate.id] = parseFloat(Math.min(100, Math.max(0, risk)).toFixed(1));
  });

  // Analyze Stands
  currentState.stands.forEach(stand => {
    const ratio = stand.occupancy / stand.capacity;
    let risk = ratio * 100;

    if (ratio > 0.85) {
      allAlerts.push({
        id: `stand-${stand.id}`,
        level: 'critical',
        source: stand.name,
        cause: `${stand.name} density threshold breached (${(ratio * 100).toFixed(0)}%)`,
        effect: `High probability of queue stagnation bleeding into primary access concourse within 2 simulation intervals.`,
        recommendation: `Deploy suppression units. Halt absolute ingress vectors to ${stand.name} and clear stairwells.`,
        urgency: risk + 10 // stands are high priority
      });
    }
    riskScores[stand.id] = parseFloat(Math.min(100, Math.max(0, risk)).toFixed(1));
  });

  // Analyze Facilities (Food/Washrooms) causing bottlenecks
  currentState.facilities.foodStalls.forEach(stall => {
     const ratio = stall.queueWaitTimeMin / 30; 
     let risk = ratio * 100;

     if(stall.queueWaitTimeMin > 18) {
        allAlerts.push({
          id: `stall-${stall.id}`,
          level: 'warning',
          source: stall.name,
          cause: `${stall.name} processing latency reaching ${Math.round(stall.queueWaitTimeMin)} mins`,
          effect: `Aggressive radial queue expansion blocking pedestrian cross-flow.`,
          recommendation: `Deploy 2 peripheral mobile vending units to external radii to diffuse localized queue pressure by 30%.`,
          urgency: risk - 10 
        });
     }
     riskScores[stall.id] = parseFloat(Math.min(100, Math.max(0, risk)).toFixed(1));
  });

  // Sort by urgency, cap at max 3, then format them.
  allAlerts.sort((a, b) => b.urgency - a.urgency);
  const criticalInsights = allAlerts.slice(0, 3).map(alert => ({
    ...alert,
    message: `${alert.cause} → ${alert.effect} → ${alert.recommendation}`
  }));

  return {
    alerts: criticalInsights,
    riskScores
  };
};
