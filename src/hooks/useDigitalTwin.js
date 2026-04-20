import { useState, useEffect, useCallback } from 'react';
import { stadiumsDB, fixturesData } from '../data/mockData';
import { fetchEnvironmentalData } from '../services/apiInterface';
import { runAIAnalysis } from '../services/predictiveModel';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const getGateStatus = (load, capacity) => {
  const ratio = load / capacity;
  if (ratio > 0.85) return 'heavy';
  if (ratio > 0.60) return 'busy';
  if (ratio > 0.40) return 'moderate';
  return 'clear';
};

const getFacilityStatus = (waitTime) => {
  if (waitTime > 18) return 'heavy';
  if (waitTime > 10) return 'busy';
  if (waitTime > 5) return 'moderate';
  return 'clear';
};

export const useDigitalTwin = (updateIntervalMs = 4000) => {
  const [currentMatchId, setCurrentMatchId] = useState(fixturesData[0].id);
  
  const currentMatch = fixturesData.find(m => m.id === currentMatchId);
  const currentStadiumBlueprint = stadiumsDB[currentMatch.venueId];

  const [data, setData] = useState(() => JSON.parse(JSON.stringify(currentStadiumBlueprint)));
  const [history, setHistory] = useState([]);
  const [matchPhase, setMatchPhase] = useState("pre-match");
  const [matchClockState, setMatchClockState] = useState(0); 
  
  const [envData, setEnvData] = useState({ condition: 'clear', temperature: 28, status: 'loading' });
  const [aiAnalysis, setAiAnalysis] = useState({ alerts: [], recommendations: [], riskScores: {} });
  
  // Real-time Event Triggers
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventTicksLeft, setEventTicksLeft] = useState(0);

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(stadiumsDB[currentMatch.venueId])));
    setHistory([]);
    setMatchPhase("pre-match");
    setMatchClockState(0);
    setActiveEvent(null);
    // Instant tick to populate UI and analytics instantly
    setTimeout(() => {
      setMatchClockState(1);
    }, 100);
  }, [currentMatchId, currentMatch.venueId]);

  useEffect(() => {
    fetchEnvironmentalData().then(res => setEnvData(res));
  }, []);

  const triggerMatchEvent = useCallback((eventType) => {
     setActiveEvent(eventType);
     setEventTicksLeft(6); // Event affects the simulation for next 6 ticks natively
  }, []);

  const internalUpdate = useCallback(() => {
    setMatchClockState(prev => prev + 1);

    setData(prev => {
      const draft = structuredClone(prev);
      let newAttendance = 0;

      let flowMultiplier = 1;
      if (envData.condition === 'rain' || envData.condition === 'storm') {
        flowMultiplier = 1.4; 
      }

      const totalExpectedAttendance = Math.floor(draft.overallCapacity * (currentMatch.bookingPercentage / 100));

      let eventFoodSpike = 0;
      let eventWashroomSpike = 0;
      let eventStandSpike = 0;

      if (activeEvent === 'wicket' && eventTicksLeft > 0) {
        eventFoodSpike = 8;       // Huge spike in food demand
        eventWashroomSpike = 6;   // Heavy washroom rush
        eventStandSpike = -100;   // People clearing out to concourse
      } else if (activeEvent === 'foul' && eventTicksLeft > 0) {
        eventFoodSpike = 2;
        eventWashroomSpike = 1;
      }

      if (eventTicksLeft > 0) {
         setEventTicksLeft(t => t - 1);
      } else if (eventTicksLeft === 0 && activeEvent) {
         setActiveEvent(null);
      }

      // 🟢 GATES (Entry Point Pipeline)
      let totalIngressThisTick = 0;
      draft.gates.forEach(gate => {
        let change = 0;
        switch (matchPhase) {
          case "pre-match": change = 10; gate.flowDirection = "in"; break;
          case "live": change = -15; break;
          case "break": change = -5; break;
          case "post-match": change = 30; gate.flowDirection = "out"; break;
        }

        change = change * flowMultiplier;
        // Suppress gate if active routing overrides
        
        gate.currentLoadPerMinute = clamp(gate.currentLoadPerMinute + change, Math.random() * 5, gate.capacityPerMinute);
        gate.status = getGateStatus(gate.currentLoadPerMinute, gate.capacityPerMinute);
        
        if (gate.flowDirection === "in") {
           totalIngressThisTick += gate.currentLoadPerMinute;
        }
      });

      // 🪑 STANDS (Feed from Gates)
      let totalStandOverflow = 0;
      draft.stands.forEach(stand => {
        let change = 0;
        if (matchPhase === "pre-match") {
           // Fans flow from Gates to Stands based on capacity chunking
           change = (totalIngressThisTick * (stand.capacity / draft.overallCapacity)) * 2; 
        } else if (matchPhase === "live") {
           change = 2; // slow trickle
        } else if (matchPhase === "break") {
           change = -40; // People leave stands for food
        } else if (matchPhase === "post-match") {
           change = -200 * flowMultiplier; // Mass exit
        }

        change += eventStandSpike; // Apply active match event logic

        const localCap = Math.floor(stand.capacity * (currentMatch.bookingPercentage / 100));
        stand.occupancy = clamp(Math.round(stand.occupancy + change), 0, localCap);
        
        // If the stand is highly saturated, people get frustrated and bleed into concourse
        if (stand.occupancy / localCap > 0.85 && matchPhase === "live") {
           totalStandOverflow += 10;
        }
        
        newAttendance += stand.occupancy;
      });

      draft.currentAttendance = clamp(newAttendance, 0, totalExpectedAttendance);

      // 🍔 FOOD STALLS (Feed from Stand Overflow & Breaks)
      draft.facilities.foodStalls.forEach(stall => {
        let change = 0;
        switch (matchPhase) {
          case "pre-match": change = 1.5; break;
          case "live": change = -2.5; break;
          case "break": change = 8; break;
          case "post-match": change = -5; break;
        }

        // Apply causal physics from stand overflow
        if (totalStandOverflow > 0) {
           change += Math.round(totalStandOverflow / draft.facilities.foodStalls.length);
        }

        if (envData.temperature > 28) change *= 1.3; 
        change += eventFoodSpike;

        stall.queueWaitTimeMin = clamp(stall.queueWaitTimeMin + change, 0, 45);
        stall.status = getFacilityStatus(stall.queueWaitTimeMin);
      });

      // 🚻 WASHROOMS
      draft.facilities.washrooms.forEach(wr => {
        let change = 0;
        switch (matchPhase) {
          case "pre-match": change = 1; break;
          case "live": change = -1.5; break;
          case "break": change = 6; break;
          case "post-match": change = -3; break;
        }

        // Apply causal physics from stand overflow
        if (totalStandOverflow > 0) {
           change += Math.round((totalStandOverflow / draft.facilities.washrooms.length) * 0.5);
        }

        change += eventWashroomSpike;

        wr.queueWaitTimeMin = clamp(wr.queueWaitTimeMin + change, 0, 25);
        wr.status = getFacilityStatus(wr.queueWaitTimeMin);
      });

      draft.lastUpdated = new Date().toISOString();
      return draft;
    });
  }, [matchPhase, envData, currentMatch, activeEvent, eventTicksLeft]);

  // Main Loop
  useEffect(() => {
    const interval = setInterval(() => {
      internalUpdate();
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [internalUpdate, updateIntervalMs]);

  // AI Core Mapping
  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, data];
      if (newHistory.length > 60) newHistory.shift(); 
      return newHistory;
    });
    
    setAiAnalysis(runAIAnalysis(history, data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    stadiumData: data,
    fixturesData,
    currentMatch,
    currentMatchId,
    setCurrentMatchId,
    matchClockState,
    history,
    envData,
    aiAnalysis,
    matchPhase,
    setMatchPhase,
    triggerMatchEvent,
    activeEvent
  };
};
