export const fixturesData = [
  {
    id: "match-1",
    homeTeam: "Mumbai Indians",
    awayTeam: "Chennai Super Kings",
    venueId: "stadium-mumbai",
    date: "2026-04-20",
    bookingPercentage: 98,
    status: 'scheduled'
  },
  {
    id: "match-2",
    homeTeam: "Royal Challengers Bangalore",
    awayTeam: "Delhi Capitals",
    venueId: "stadium-bglr",
    date: "2026-04-21",
    bookingPercentage: 72,
    status: 'scheduled'
  },
  {
    id: "match-3",
    homeTeam: "Kolkata Knight Riders",
    awayTeam: "Rajasthan Royals",
    venueId: "stadium-kolkata",
    date: "2026-04-22",
    bookingPercentage: 88,
    status: 'scheduled'
  }
];

export const stadiumsDB = {
  "stadium-mumbai": {
    id: "stadium-mumbai",
    name: "Wankhede Stadium, Mumbai",
    overallCapacity: 33000,
    currentAttendance: 0,
    gates: [
      { id: "g-m-1", name: "Gate 1 (Vinoo Mankad)", type: "Standard", capacityPerMinute: 80, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-m-2", name: "Gate 3 (VIP Pavilion)", type: "VIP", capacityPerMinute: 40, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-m-3", name: "Gate 5 (Divecha Pavilion)", type: "Standard", capacityPerMinute: 90, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-m-4", name: "Gate 7 (Garware)", type: "Main", capacityPerMinute: 120, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" }
    ],
    stands: [
      { id: "s-m-n", name: "Tata Pavilion (North)", type: "VIP", capacity: 5000, occupancy: 0 },
      { id: "s-m-s", name: "Garware Pavilion (South)", type: "General", capacity: 12000, occupancy: 0 },
      { id: "s-m-e", name: "Sunil Gavaskar Stand (East)", type: "General", capacity: 8000, occupancy: 0 },
      { id: "s-m-w", name: "Vijay Merchant Stand (West)", type: "General", capacity: 8000, occupancy: 0 }
    ],
    facilities: {
      foodStalls: [
        { id: "f-m-1", name: "Mumbai Indians Cafe", queueWaitTimeMin: 0, status: "clear" },
        { id: "f-m-2", name: "Garware Food Court", queueWaitTimeMin: 0, status: "clear" },
        { id: "f-m-3", name: "North Stand Snacks", queueWaitTimeMin: 0, status: "clear" }
      ],
      washrooms: [
        { id: "w-m-1", name: "Washroom A (South)", queueWaitTimeMin: 0, status: "clear" },
        { id: "w-m-2", name: "Washroom B (North)", queueWaitTimeMin: 0, status: "clear" }
      ]
    }
  },
  "stadium-bglr": {
    id: "stadium-bglr",
    name: "Chinnaswamy Stadium, Bangalore",
    overallCapacity: 40000,
    currentAttendance: 0,
    gates: [
      { id: "g-b-1", name: "Gate 1 (Queens Road)", type: "Main", capacityPerMinute: 150, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-b-2", name: "Gate 6 (Pavilion)", type: "VIP", capacityPerMinute: 50, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-b-3", name: "Gate 9 (Link Road)", type: "Standard", capacityPerMinute: 110, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" }
    ],
    stands: [
      { id: "s-b-n", name: "P1 Annex (North)", type: "General", capacity: 10000, occupancy: 0 },
      { id: "s-b-s", name: "Pavilion Terrace (South)", type: "VIP", capacity: 6000, occupancy: 0 },
      { id: "s-b-e", name: "M. Chinnaswamy Stand (East)", type: "General", capacity: 12000, occupancy: 0 },
      { id: "s-b-w", name: "BEML Stand (West)", type: "General", capacity: 12000, occupancy: 0 }
    ],
    facilities: {
      foodStalls: [
        { id: "f-b-1", name: "RCB Bar & Cafe", queueWaitTimeMin: 0, status: "clear" },
        { id: "f-b-2", name: "East Stand Food Zone", queueWaitTimeMin: 0, status: "clear" }
      ],
      washrooms: [
        { id: "w-b-1", name: "Washroom Block A", queueWaitTimeMin: 0, status: "clear" },
        { id: "w-b-2", name: "Washroom Block B", queueWaitTimeMin: 0, status: "clear" }
      ]
    }
  },
  "stadium-kolkata": {
    id: "stadium-kolkata",
    name: "Eden Gardens, Kolkata",
    overallCapacity: 66000, // Massive
    currentAttendance: 0,
    gates: [
      { id: "g-k-1", name: "Gate 1", type: "Main", capacityPerMinute: 200, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-k-2", name: "Gate 3L", type: "Standard", capacityPerMinute: 130, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" },
      { id: "g-k-3", name: "Club House Gate", type: "VIP", capacityPerMinute: 60, currentLoadPerMinute: 0, flowDirection: "in", status: "clear" }
    ],
    stands: [
      { id: "s-k-n", name: "B.C. Roy Club House", type: "VIP", capacity: 8000, occupancy: 0 },
      { id: "s-k-s", name: "Block B (Highways)", type: "General", capacity: 20000, occupancy: 0 },
      { id: "s-k-e", name: "Block F", type: "General", capacity: 19000, occupancy: 0 },
      { id: "s-k-w", name: "Block K", type: "General", capacity: 19000, occupancy: 0 }
    ],
    facilities: {
      foodStalls: [
        { id: "f-k-1", name: "Eden Food Plazza", queueWaitTimeMin: 0, status: "clear" },
        { id: "f-k-2", name: "Clubhouse Lounge", queueWaitTimeMin: 0, status: "clear" }
      ],
      washrooms: [
        { id: "w-k-1", name: "Washroom F", queueWaitTimeMin: 0, status: "clear" },
        { id: "w-k-2", name: "Washroom Clubhouse", queueWaitTimeMin: 0, status: "clear" }
      ]
    }
  }
};