import { Trip } from "@/contexts/BookingContext";

export const MOCK_TRIPS: Trip[] = [
  {
    id: "trip_A1",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "06:00",
    arrivalTime: "13:30",
    duration: "7h 30m",
    price: 420,
    availableSeats: 18,
    totalSeats: 44,
    busType: "Primera Plus",
    amenities: ["WiFi", "AC", "USB", "Snacks", "Baño"],
    occupiedSeats: [1, 2, 5, 6, 10, 11, 15, 20, 21, 25, 30, 31, 35, 36, 40, 41],
  },
  {
    id: "trip_A2",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "08:00",
    arrivalTime: "15:30",
    duration: "7h 30m",
    price: 450,
    availableSeats: 22,
    totalSeats: 44,
    busType: "Primera Plus",
    amenities: ["WiFi", "AC", "USB", "Snacks", "Baño"],
    occupiedSeats: [3, 4, 7, 8, 14, 19, 24, 29, 33, 38, 43, 44],
  },
  {
    id: "trip_A3",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "10:30",
    arrivalTime: "18:00",
    duration: "7h 30m",
    price: 380,
    availableSeats: 30,
    totalSeats: 44,
    busType: "Ejecutivo",
    amenities: ["AC", "USB", "Baño"],
    occupiedSeats: [1, 5, 10, 15, 20, 25, 30, 35, 40, 44, 43, 42, 41, 37],
  },
  {
    id: "trip_A4",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "13:00",
    arrivalTime: "20:30",
    duration: "7h 30m",
    price: 480,
    availableSeats: 8,
    totalSeats: 44,
    busType: "Premium",
    amenities: ["WiFi", "AC", "USB", "Snacks", "Baño", "Asientos cama"],
    occupiedSeats: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    ],
  },
  {
    id: "trip_A5",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "16:00",
    arrivalTime: "23:30",
    duration: "7h 30m",
    price: 350,
    availableSeats: 35,
    totalSeats: 44,
    busType: "Económico",
    amenities: ["AC", "Baño"],
    occupiedSeats: [2, 9, 18, 27, 36, 37, 38, 44, 43],
  },
  {
    id: "trip_A6",
    origin: "Durango",
    destination: "Guadalajara",
    date: "",
    departureTime: "22:00",
    arrivalTime: "05:30",
    duration: "7h 30m",
    price: 390,
    availableSeats: 26,
    totalSeats: 44,
    busType: "Ejecutivo",
    amenities: ["AC", "USB", "Baño"],
    occupiedSeats: [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 44, 43, 42, 41, 37, 36],
  },
];

export function searchTrips(origin: string, destination: string, date: string): Trip[] {
  return MOCK_TRIPS.filter(
    (t) =>
      t.origin.toLowerCase().includes(origin.toLowerCase()) &&
      t.destination.toLowerCase().includes(destination.toLowerCase())
  ).map((t) => ({ ...t, date }));
}

export const POPULAR_ROUTES = [
  { origin: "Durango", destination: "Guadalajara" },
  { origin: "Guadalajara", destination: "Durango" },
];
