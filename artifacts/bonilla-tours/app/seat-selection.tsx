import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";
import { SeatMap } from "@/components/SeatMap";
import { useBooking } from "@/contexts/BookingContext";
import { useColors } from "@/hooks/useColors";

export default function SeatSelectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { pendingTrip, pendingSeats, setPendingSeats } = useBooking();

  if (!pendingTrip) {
    router.back();
    return null;
  }

  const handleToggleSeat = (seat: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPendingSeats(
      pendingSeats.includes(seat)
        ? pendingSeats.filter((s) => s !== seat)
        : [...pendingSeats, seat]
    );
  };

  const handleContinue = () => {
    router.push("/checkout");
  };

  const totalPrice = pendingSeats.length * pendingTrip.price;

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
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Selecciona asientos
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {pendingTrip.origin} → {pendingTrip.destination} · {pendingTrip.departureTime}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 120),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.busInfo,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.busInfoRow}>
            <View style={styles.busInfoItem}>
              <Text style={[styles.busInfoLabel, { color: colors.mutedForeground }]}>
                Tipo
              </Text>
              <Text style={[styles.busInfoValue, { color: colors.foreground }]}>
                {pendingTrip.busType}
              </Text>
            </View>
            <View style={styles.busInfoItem}>
              <Text style={[styles.busInfoLabel, { color: colors.mutedForeground }]}>
                Disponibles
              </Text>
              <Text style={[styles.busInfoValue, { color: colors.foreground }]}>
                {pendingTrip.availableSeats}
              </Text>
            </View>
            <View style={styles.busInfoItem}>
              <Text style={[styles.busInfoLabel, { color: colors.mutedForeground }]}>
                Precio/asiento
              </Text>
              <Text style={[styles.busInfoValue, { color: colors.primary }]}>
                ${pendingTrip.price}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.seatMapContainer}>
          <SeatMap
            totalSeats={pendingTrip.totalSeats}
            occupiedSeats={pendingTrip.occupiedSeats}
            selectedSeats={pendingSeats}
            onToggleSeat={handleToggleSeat}
          />
        </View>

        {pendingSeats.length > 0 && (
          <View
            style={[
              styles.selectedInfo,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.selectedTitle, { color: colors.primary }]}>
              Asientos seleccionados
            </Text>
            <Text style={[styles.selectedSeats, { color: colors.foreground }]}>
              {pendingSeats.sort((a, b) => a - b).join(", ")}
            </Text>
          </View>
        )}
      </ScrollView>

      {pendingSeats.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
            },
          ]}
        >
          <View style={styles.footerInfo}>
            <Text style={[styles.footerSeats, { color: colors.mutedForeground }]}>
              {pendingSeats.length} asiento{pendingSeats.length !== 1 ? "s" : ""}
            </Text>
            <Text style={[styles.footerTotal, { color: colors.foreground }]}>
              ${totalPrice}{" "}
              <Text style={[styles.footerCurrency, { color: colors.mutedForeground }]}>
                MXN
              </Text>
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Continuar" onPress={handleContinue} />
          </View>
        </View>
      )}
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
  headerTitle: { fontSize: 17, fontWeight: "700" },
  headerSub: { fontSize: 13, marginTop: 2 },
  scroll: { padding: 16 },
  busInfo: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  busInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  busInfoItem: { alignItems: "center", gap: 2 },
  busInfoLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  busInfoValue: { fontSize: 16, fontWeight: "700" },
  seatMapContainer: {
    paddingHorizontal: 8,
  },
  selectedInfo: {
    padding: 14,
    marginTop: 16,
    gap: 4,
  },
  selectedTitle: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  selectedSeats: { fontSize: 18, fontWeight: "800" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderTopWidth: 1,
  },
  footerInfo: { alignItems: "flex-start" },
  footerSeats: { fontSize: 12, fontWeight: "600" },
  footerTotal: { fontSize: 22, fontWeight: "800" },
  footerCurrency: { fontSize: 14, fontWeight: "500" },
});
