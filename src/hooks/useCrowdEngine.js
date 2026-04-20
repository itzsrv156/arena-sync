import { useState, useEffect, useCallback } from 'react';
import { stadiumData as initialData } from '../data/mockData';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const getGateStatus = (load, capacity) => {
  const ratio = load / capacity;
  if (ratio > 0.85) return 'heavy';
  if (ratio > 0.70) return 'busy';
  if (ratio > 0.50) return 'moderate';
  return 'clear';
};

const getFacilityStatus = (waitTime) => {
  if (waitTime > 15) return 'heavy';
  if (waitTime > 10) return 'busy';
  if (waitTime > 5) return 'moderate';
  return 'clear';
};

export const useCrowdEngine = (updateIntervalMs = 4000) => {
  const [data, setData] = useState(initialData);
  const [matchPhase, setMatchPhase] = useState("pre-match");

  const updateSimulation = useCallback(() => {

    setData(prev => {
      const draft = structuredClone(prev);
      let newAttendance = 0;

      // 🟢 GATES
      draft.gates.forEach(gate => {
        let change = 0;

        switch (matchPhase) {
          case "pre-match":
            change = 4;
            gate.flowDirection = "in";
            break;

          case "live":
            change = -6;
            break;

          case "break":
            change = -3;
            break;

          case "post-match":
            change = 15;
            gate.flowDirection = "out";
            break;
        }

        gate.currentLoadPerMinute = clamp(
          gate.currentLoadPerMinute + change,
          0,
          gate.capacityPerMinute
        );

        gate.status = getGateStatus(
          gate.currentLoadPerMinute,
          gate.capacityPerMinute
        );
      });

      // 🪑 STANDS
      draft.stands.forEach(stand => {
        let change = 0;

        switch (matchPhase) {
          case "pre-match":
            change = 80;
            break;

          case "live":
            change = 0;
            break;

          case "break":
            change = -30;
            break;

          case "post-match":
            change = -120;
            break;
        }

        stand.occupancy = clamp(
          stand.occupancy + change,
          0,
          stand.capacity
        );

        newAttendance += stand.occupancy;
      });

      draft.currentAttendance = newAttendance;

      // 🍔 FOOD STALLS
      draft.facilities.foodStalls.forEach(stall => {
        let change = 0;

        switch (matchPhase) {
          case "pre-match":
            change = 1;
            break;

          case "live":
            change = -1;
            break;

          case "break":
            change = 2;
            break;

          case "post-match":
            change = -2;
            break;
        }

        stall.queueWaitTimeMin = clamp(
          stall.queueWaitTimeMin + change,
          0,
          30
        );

        stall.status = getFacilityStatus(stall.queueWaitTimeMin);
      });

      // 🚻 WASHROOMS
      draft.facilities.washrooms.forEach(wr => {
        let change = 0;

        switch (matchPhase) {
          case "pre-match":
            change = 1;
            break;

          case "live":
            change = -1;
            break;

          case "break":
            change = 2;
            break;

          case "post-match":
            change = -1;
            break;
        }

        wr.queueWaitTimeMin = clamp(
          wr.queueWaitTimeMin + change,
          0,
          25
        );

        wr.status = getFacilityStatus(wr.queueWaitTimeMin);
      });

      draft.lastUpdated = new Date().toISOString();

      return draft;
    });

  }, [matchPhase]);

  // 🔥 INTERVAL (SAFE)
  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulation();
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [updateSimulation, updateIntervalMs]);

  const stepSimulation = () => updateSimulation();

  return {
    stadiumData: data,
    matchPhase,
    setMatchPhase,
    stepSimulation
  };
};