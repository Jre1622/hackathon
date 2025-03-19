// This file contains data about major population centers around the world
// Used to create interactive points on the globe

const populationCenters = [
  // North America
  { name: "New York", lat: 40.7128, lng: -74.006, size: 8.8, color: 0xff9900 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, size: 7.5, color: 0xff9900 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832, size: 6.5, color: 0xff9900 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332, size: 9.0, color: 0xff9900 },

  // South America
  { name: "São Paulo", lat: -23.5505, lng: -46.6333, size: 8.5, color: 0x33cc33 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816, size: 7.0, color: 0x33cc33 },
  { name: "Bogotá", lat: 4.711, lng: -74.0721, size: 6.8, color: 0x33cc33 },

  // Europe
  { name: "London", lat: 51.5074, lng: -0.1278, size: 8.0, color: 0x3366ff },
  { name: "Paris", lat: 48.8566, lng: 2.3522, size: 7.8, color: 0x3366ff },
  { name: "Berlin", lat: 52.52, lng: 13.405, size: 6.7, color: 0x3366ff },
  { name: "Moscow", lat: 55.7558, lng: 37.6173, size: 8.2, color: 0x3366ff },

  // Asia
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, size: 9.2, color: 0xff3399 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, size: 8.9, color: 0xff3399 },
  { name: "Delhi", lat: 28.6139, lng: 77.209, size: 9.1, color: 0xff3399 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, size: 7.2, color: 0xff3399 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, size: 6.0, color: 0xff3399 },

  // Africa
  { name: "Cairo", lat: 30.0444, lng: 31.2357, size: 7.8, color: 0xffcc00 },
  { name: "Lagos", lat: 6.5244, lng: 3.3792, size: 8.0, color: 0xffcc00 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, size: 6.5, color: 0xffcc00 },
  { name: "Johannesburg", lat: -26.2041, lng: 28.0473, size: 6.8, color: 0xffcc00 },

  // Australia & Oceania
  { name: "Sydney", lat: -33.8688, lng: 151.2093, size: 7.0, color: 0x9966ff },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631, size: 6.8, color: 0x9966ff },
  { name: "Auckland", lat: -36.8509, lng: 174.7645, size: 5.5, color: 0x9966ff },
];

// Tech hubs with higher attention
const techHubs = [
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, size: 10, color: 0x00ffff },
  { name: "Seoul", lat: 37.5665, lng: 126.978, size: 9.5, color: 0x00ffff },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, size: 9.8, color: 0x00ffff },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, size: 8.5, color: 0x00ffff },
  { name: "Stockholm", lat: 59.3293, lng: 18.0686, size: 8.0, color: 0x00ffff },
];

// Combine the arrays for easy access
const allCenters = [...populationCenters, ...techHubs];
