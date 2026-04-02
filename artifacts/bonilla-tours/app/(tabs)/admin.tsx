import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookingCard } from "@/components/BookingCard";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

type FilterType = "all" | "confirmed" | "pending" | "cancelled" | "guest" | "user";

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBooking();
  const [filter, setFilter] = useState<FilterType>("all");

  if (!user || user.role !== "admin") {
    return (
      <View
        style={[
          styles.unauthorized,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
          },
        ]}
      >
        <Feather name="lock" size={48} color={colors.mutedForeground} />
        <Text style={[styles.unauthorizedTitle, { color: colors.foreground }]}>
          Acceso restringido
        </Text>
        <Text style={[styles.unauthorizedSub, { color: colors.mutedForeground }]}>
          Solo los administradores pueden ver este panel
        </Text>
      </View>
    );
  }

  const filtered = useMemo(() => {
    switch (filter) {
      case "confirmed": return bookings.filter((b) => b.status === "confirmed");
      case "pending": return bookings.filter((b) => b.status === "pending");
      case "cancelled": return bookings.filter((b) => b.status === "cancelled");
      case "guest": return bookings.filter((b) => b.isGuest);
      case "user": return bookings.filter((b) => !b.isGuest);
      default: return bookings;
    }
  }, [bookings, filter]);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    guests: bookings.filter((b) => b.isGuest).length,
    revenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.totalPrice, 0),
  };

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "confirmed", label: "Confirmadas" },
    { key: "pending", label: "Pendientes" },
    { key: "cancelled", label: "Canceladas" },
    { key: "guest", label: "Invitados" },
    { key: "user", label: "Registrados" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            Panel Admin
          </Text>
          <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
            Gestión de reservas
          </Text>
        </View>
        <View
          style={[
            styles.adminTag,
            { backgroundColor: colors.primary, borderRadius: colors.radius / 2 },
          ]}
        >
          <Feather name="shield" size={14} color="#fff" />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        ListHeaderComponent={
          <>
            <View style={styles.statsGrid}>
              {[
                { label: "Total reservas", value: stats.total, icon: "list" },
                { label: "Confirmadas", value: stats.confirmed, icon: "check-circle" },
                { label: "Pendientes", value: stats.pending, icon: "clock" },
                { label: "Invitados", value: stats.guests, icon: "user" },
              ].map(({ label, value, icon }) => (
                <View
                  key={label}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: colors.card,
                      borderRadius: colors.radius,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Feather name={icon as any} size={18} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.foreground }]}>
                    {value}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.revenueCard,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                  marginHorizontal: 16,
                  marginBottom: 12,
                },
              ]}
            >
              <Feather name="dollar-sign" size={20} color="rgba(255,255,255,0.8)" />
              <View>
                <Text style={styles.revenueLabel}>Ingresos totales</Text>
                <Text style={styles.revenueValue}>
                  ${stats.revenue.toLocaleString("es-MX")} MXN
                </Text>
              </View>
            </View>

            <FlatList
              data={FILTERS}
              keyExtractor={(f) => f.key}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor:
                        filter === item.key
                          ? colors.primary
                          : colors.card,
                      borderRadius: colors.radius / 2,
                      borderColor:
                        filter === item.key
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => setFilter(item.key)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          filter === item.key
                            ? "#fff"
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text
              style={[
                styles.listHeader,
                { color: colors.foreground, paddingHorizontal: 16, marginBottom: 8 },
              ]}
            >
              {filtered.length} reserva{filtered.length !== 1 ? "s" : ""}
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={cancelBooking} isAdmin />
        )}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No hay reservas para este filtro
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  unauthorized: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  unauthorizedTitle: { fontSize: 20, fontWeight: "700" },
  unauthorizedSub: { fontSize: 14, textAlign: "center" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  screenTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  screenSub: { fontSize: 13, marginTop: 2 },
  adminTag: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    padding: 16,
    paddingBottom: 0,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    padding: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  revenueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginTop: 12,
  },
  revenueLabel: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  revenueValue: { fontSize: 22, fontWeight: "800", color: "#fff" },
  filtersScroll: { paddingHorizontal: 16, gap: 8, paddingVertical: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: "600" },
  listHeader: { fontSize: 14, fontWeight: "600" },
  empty: { alignItems: "center", gap: 10, paddingTop: 40 },
  emptyText: { fontSize: 14 },
});
