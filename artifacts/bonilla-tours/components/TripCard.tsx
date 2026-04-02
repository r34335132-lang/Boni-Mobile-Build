import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Trip } from "@/contexts/BookingContext";

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

const AMENITY_ICONS: Record<string, string> = {
  WiFi: "wifi",
  AC: "wind",
  USB: "zap",
  Snacks: "coffee",
  Baño: "droplet",
  "Asientos cama": "moon",
};

export function TripCard({ trip, onSelect }: TripCardProps) {
  const colors = useColors();
  const availabilityPct = trip.availableSeats / trip.totalSeats;
  const isAlmostFull = availabilityPct < 0.2;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onSelect(trip)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.times}>
          <Text style={[styles.time, { color: colors.foreground }]}>
            {trip.departureTime}
          </Text>
          <View style={styles.durationRow}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>
          <Text style={[styles.time, { color: colors.foreground }]}>
            {trip.arrivalTime}
          </Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${trip.price}
          </Text>
          <Text style={[styles.currency, { color: colors.mutedForeground }]}>
            MXN
          </Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={[styles.duration, { color: colors.mutedForeground }]}>
          {trip.duration}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.secondary,
              borderRadius: colors.radius / 2,
            },
          ]}
        >
          <Text style={[styles.busType, { color: colors.primary }]}>
            {trip.busType}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.amenities}>
          {trip.amenities.slice(0, 4).map((amenity) => (
            <View
              key={amenity}
              style={[
                styles.amenityChip,
                { backgroundColor: colors.muted, borderRadius: 6 },
              ]}
            >
              <Feather
                name={(AMENITY_ICONS[amenity] as any) ?? "check"}
                size={11}
                color={colors.mutedForeground}
              />
              <Text style={[styles.amenityText, { color: colors.mutedForeground }]}>
                {amenity}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.seats}>
          <Feather
            name="users"
            size={13}
            color={isAlmostFull ? colors.warning : colors.mutedForeground}
          />
          <Text
            style={[
              styles.seatsText,
              {
                color: isAlmostFull ? colors.warning : colors.mutedForeground,
              },
            ]}
          >
            {trip.availableSeats} disponibles
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  times: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  time: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  line: {
    flex: 1,
    height: 1,
  },
  priceBlock: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  currency: {
    fontSize: 11,
    fontWeight: "500",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  duration: {
    fontSize: 13,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  busType: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  amenities: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    flex: 1,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: "500",
  },
  seats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seatsText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
