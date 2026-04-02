import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";
import { Booking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function BookingSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuth();
  const { bookingId, bookingData } = useLocalSearchParams<{
    bookingId: string;
    bookingData: string;
  }>();

  const booking: Booking | null = bookingData ? JSON.parse(bookingData) : null;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 12,
        stiffness: 180,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleCreateAccount = () => {
    router.push("/(auth)/register");
  };

  const handleViewTrips = () => {
    router.replace("/(tabs)/my-trips");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scroll,
        {
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 24),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 32),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.successCircle,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.success, "#059669"]}
          style={[styles.successIconBg, { borderRadius: 60 }]}
        >
          <Feather name="check" size={48} color="#fff" />
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.textBlock, { opacity: opacityAnim }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          ¡Reserva exitosa!
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Tu viaje está confirmado
        </Text>
      </Animated.View>

      {booking && (
        <View
          style={[
            styles.bookingCard,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.bookingIdRow}>
            <Text style={[styles.bookingIdLabel, { color: colors.mutedForeground }]}>
              ID de reserva
            </Text>
            <Text style={[styles.bookingId, { color: colors.primary }]}>
              # {booking.id}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailsGrid}>
            {[
              {
                icon: "map-pin",
                label: "Ruta",
                value: `${booking.trip.origin} → ${booking.trip.destination}`,
              },
              {
                icon: "calendar",
                label: "Fecha",
                value: booking.trip.date,
              },
              {
                icon: "clock",
                label: "Horario",
                value: `${booking.trip.departureTime} – ${booking.trip.arrivalTime}`,
              },
              {
                icon: "grid",
                label: "Asientos",
                value: booking.seats.sort((a, b) => a - b).join(", "),
              },
              {
                icon: "users",
                label: "Pasajero",
                value: booking.passengerName,
              },
              {
                icon: "credit-card",
                label: "Pago",
                value: booking.paymentMethod === "card" ? "Tarjeta" : "Efectivo",
              },
            ].map(({ icon, label, value }) => (
              <View key={label} style={styles.detailRow}>
                <Feather name={icon as any} size={14} color={colors.mutedForeground} />
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
                  {label}:
                </Text>
                <Text
                  style={[styles.detailValue, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.totalRow,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius / 2,
              },
            ]}
          >
            <Text style={[styles.totalLabel, { color: colors.primary }]}>
              Total pagado
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${booking.totalPrice} MXN
            </Text>
          </View>
        </View>
      )}

      {isGuest && (
        <View
          style={[
            styles.guestBox,
            {
              backgroundColor: colors.accent,
              borderRadius: colors.radius,
              borderColor: colors.primary + "30",
            },
          ]}
        >
          <Feather name="mail" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.guestBoxTitle, { color: colors.primary }]}>
              Confirmación enviada
            </Text>
            <Text style={[styles.guestBoxText, { color: colors.accentForeground }]}>
              Tu reserva ha sido guardada. Puedes acceder a ella con tu email o
              crear una cuenta para gestionar tus viajes.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {isGuest && (
          <AppButton
            title="Crear cuenta (opcional)"
            onPress={handleCreateAccount}
            variant="outline"
          />
        )}
        {user && (
          <AppButton
            title="Ver mis viajes"
            onPress={handleViewTrips}
            variant="outline"
          />
        )}
        <AppButton
          title="Volver al inicio"
          onPress={handleGoHome}
          variant="ghost"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 20,
  },
  successCircle: {
    marginTop: 12,
    marginBottom: 4,
  },
  successIconBg: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 4 },
  bookingCard: {
    width: "100%",
    padding: 18,
    borderWidth: 1,
    gap: 0,
  },
  bookingIdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  bookingIdLabel: { fontSize: 12, fontWeight: "600" },
  bookingId: { fontSize: 18, fontWeight: "800", letterSpacing: 1 },
  divider: { height: 1, marginBottom: 14 },
  detailsGrid: { gap: 8, marginBottom: 14 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailLabel: { fontSize: 13, fontWeight: "500", width: 70 },
  detailValue: { fontSize: 13, fontWeight: "600", flex: 1 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  totalLabel: { fontSize: 14, fontWeight: "700" },
  totalValue: { fontSize: 20, fontWeight: "800" },
  guestBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    width: "100%",
    borderWidth: 1,
  },
  guestBoxTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  guestBoxText: { fontSize: 13, lineHeight: 18 },
  actions: { width: "100%", gap: 10 },
});
