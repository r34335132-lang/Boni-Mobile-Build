import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TripCard } from "@/components/TripCard";
import { Trip, useBooking } from "@/contexts/BookingContext";
import { useColors } from "@/hooks/useColors";

export default function SearchResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { origin, destination, date, results } = useLocalSearchParams<{
    origin: string;
    destination: string;
    date: string;
    results: string;
  }>();
  const { setPendingTrip, setPendingSeats } = useBooking();

  const trips: Trip[] = useMemo(() => {
    try {
      return JSON.parse(results ?? "[]");
    } catch {
      return [];
    }
  }, [results]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(date + "T00:00:00").toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return date;
    }
  }, [date]);

  const handleSelect = (trip: Trip) => {
    setPendingTrip(trip);
    setPendingSeats([]);
    router.push("/seat-selection");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.route, { color: colors.foreground }]}>
            {origin} → {destination}
          </Text>
          <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
            {formattedDate}
          </Text>
        </View>
      </View>

      <FlatList
        data={trips}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TripCard trip={item} onSelect={handleSelect} />
        )}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32),
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.count, { color: colors.mutedForeground }]}>
            {trips.length} salida{trips.length !== 1 ? "s" : ""} disponible{trips.length !== 1 ? "s" : ""}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Sin resultados
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No hay viajes disponibles para esta ruta y fecha
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  route: { fontSize: 17, fontWeight: "700" },
  dateText: { fontSize: 13, marginTop: 2, textTransform: "capitalize" },
  count: { fontSize: 13, fontWeight: "600", paddingHorizontal: 16, marginBottom: 8 },
  empty: { alignItems: "center", gap: 10, paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center" },
});
