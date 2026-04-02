import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  busType: string;
  amenities: string[];
  occupiedSeats: number[];
}

export interface Booking {
  id: string;
  trip: Trip;
  seats: number[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  paymentMethod: "card" | "cash";
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
  userId: string | null;
  isGuest: boolean;
  totalPrice: number;
}

interface BookingContextValue {
  bookings: Booking[];
  pendingTrip: Trip | null;
  pendingSeats: number[];
  setPendingTrip: (trip: Trip | null) => void;
  setPendingSeats: (seats: number[]) => void;
  confirmBooking: (
    booking: Omit<Booking, "id" | "createdAt">
  ) => Promise<Booking>;
  getUserBookings: (userId: string) => Booking[];
  getGuestBookings: (email: string) => Booking[];
  cancelBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const STORAGE_KEY = "bonilla_bookings";

const generateMockBookings = (): Booking[] => [
  {
    id: "BT-001234",
    trip: {
      id: "trip_001",
      origin: "Durango",
      destination: "Guadalajara",
      date: "2026-04-05",
      departureTime: "08:00",
      arrivalTime: "15:30",
      duration: "7h 30m",
      price: 450,
      availableSeats: 12,
      totalSeats: 44,
      busType: "Primera Plus",
      amenities: ["WiFi", "AC", "USB", "Snacks"],
      occupiedSeats: [1, 2, 5, 6, 10, 11, 15, 20, 21, 25, 30, 31, 35],
    },
    seats: [7],
    passengerName: "Luis Rodríguez",
    passengerEmail: "luis@example.com",
    passengerPhone: "+52 618 555 0001",
    paymentMethod: "card",
    status: "confirmed",
    createdAt: "2026-04-02T10:00:00Z",
    userId: null,
    isGuest: true,
    totalPrice: 450,
  },
  {
    id: "BT-005678",
    trip: {
      id: "trip_002",
      origin: "Durango",
      destination: "Guadalajara",
      date: "2026-04-10",
      departureTime: "14:00",
      arrivalTime: "21:30",
      duration: "7h 30m",
      price: 380,
      availableSeats: 20,
      totalSeats: 44,
      busType: "Ejecutivo",
      amenities: ["AC", "USB"],
      occupiedSeats: [3, 4, 8, 12, 16],
    },
    seats: [22, 23],
    passengerName: "Ana Torres",
    passengerEmail: "ana@example.com",
    passengerPhone: "+52 618 555 0002",
    paymentMethod: "cash",
    status: "pending",
    createdAt: "2026-04-02T11:00:00Z",
    userId: "user_001",
    isGuest: false,
    totalPrice: 760,
  },
];

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingTrip, setPendingTrip] = useState<Trip | null>(null);
  const [pendingSeats, setPendingSeats] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setBookings(JSON.parse(stored));
        } else {
          const mock = generateMockBookings();
          setBookings(mock);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
        }
      } catch {}
    })();
  }, []);

  const confirmBooking = useCallback(
    async (bookingData: Omit<Booking, "id" | "createdAt">): Promise<Booking> => {
      await new Promise((r) => setTimeout(r, 1200));
      const id =
        "BT-" +
        Math.floor(100000 + Math.random() * 900000)
          .toString()
          .slice(0, 6);
      const newBooking: Booking = {
        ...bookingData,
        id,
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => {
        const updated = [newBooking, ...prev];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      return newBooking;
    },
    []
  );

  const getUserBookings = useCallback(
    (userId: string) => bookings.filter((b) => b.userId === userId),
    [bookings]
  );

  const getGuestBookings = useCallback(
    (email: string) =>
      bookings.filter(
        (b) => b.isGuest && b.passengerEmail.toLowerCase() === email.toLowerCase()
      ),
    [bookings]
  );

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        pendingTrip,
        pendingSeats,
        setPendingTrip,
        setPendingSeats,
        confirmBooking,
        getUserBookings,
        getGuestBookings,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
