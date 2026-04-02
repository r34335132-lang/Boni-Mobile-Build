import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useColors } from "@/hooks/useColors";
import { POPULAR_ROUTES, searchTrips } from "@/data/trips";

const TODAY = new Date().toISOString().split("T")[0];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuth();
  const { setPendingTrip, setPendingSeats } = useBooking();

  const [origin, setOrigin] = useState("Durango");
  const [destination, setDestination] = useState("Guadalajara");
  const [date, setDate] = useState(TODAY);
  const [dateInput, setDateInput] = useState(
    new Date().toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  );

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSearch = () => {
    const trips = searchTrips(origin, destination, date);
    router.push({
      pathname: "/search-results",
      params: { origin, destination, date, results: JSON.stringify(trips) },
    });
  };

  const handlePopularRoute = (o: string, d: string) => {
    setOrigin(o);
    setDestination(d);
  };

  const greeting = user
    ? `Hola, ${user.name.split(" ")[0]}`
    : isGuest
    ? "Hola, invitado"
    : "Busca tu viaje";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
      }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, "#0F3BB4"]}
        style={[
          styles.header,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.headerSub}>¿A dónde viajas hoy?</Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20 },
            ]}
          >
            <Feather
              name={user?.role === "admin" ? "shield" : isGuest ? "user" : "user-check"}
              size={18}
              color="#fff"
            />
          </View>
        </View>

        <View
          style={[
            styles.searchCard,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius * 1.5,
              marginTop: 20,
            },
          ]}
        >
          <View style={styles.routeRow}>
            <View style={styles.routeField}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Origen
              </Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.foreground }]}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Ciudad de origen"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
            <TouchableOpacity
              onPress={handleSwap}
              style={[
                styles.swapBtn,
                { backgroundColor: colors.secondary, borderRadius: 20 },
              ]}
            >
              <Feather name="repeat" size={16} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.routeField}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Destino
              </Text>
              <TextInput
                style={[styles.fieldInput, { color: colors.foreground }]}
                value={destination}
                onChangeText={setDestination}
                placeholder="Ciudad destino"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.border }]}
          />

          <View style={styles.dateRow}>
            <Feather name="calendar" size={16} color={colors.mutedForeground} />
            <Text style={[styles.dateText, { color: colors.foreground }]}>
              {dateInput}
            </Text>
            <Text style={[styles.dateHint, { color: colors.mutedForeground }]}>
              (Hoy)
            </Text>
          </View>

          <View style={{ paddingHorizontal: 4, paddingBottom: 4 }}>
            <AppButton title="Buscar viajes" onPress={handleSearch} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Rutas populares
        </Text>
        <View style={styles.routes}>
          {POPULAR_ROUTES.map(({ origin: o, destination: d }) => (
            <TouchableOpacity
              key={`${o}-${d}`}
              style={[
                styles.routeChip,
                {
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handlePopularRoute(o, d)}
              activeOpacity={0.7}
            >
              <Feather name="navigation" size={14} color={colors.primary} />
              <Text style={[styles.routeChipText, { color: colors.foreground }]}>
                {o} → {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          ¿Por qué Bonilla Tour's?
        </Text>
        <View style={styles.features}>
          {[
            { icon: "shield", title: "Seguridad", desc: "Flotilla moderna y revisada" },
            { icon: "clock", title: "Puntualidad", desc: "Salidas en tiempo y forma" },
            { icon: "wifi", title: "Comodidad", desc: "WiFi, USB y snacks incluidos" },
            { icon: "credit-card", title: "Pago flexible", desc: "Tarjeta o efectivo" },
          ].map(({ icon, title, desc }) => (
            <View
              key={title}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: colors.secondary,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Feather name={icon as any} size={20} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                {title}
              </Text>
              <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>
                {desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  badge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchCard: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  routeField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldInput: {
    fontSize: 16,
    fontWeight: "700",
  },
  swapBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  divider: { height: 1, marginBottom: 12 },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
  },
  dateHint: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  routes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  routeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  routeChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "47%",
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  featureIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
});
