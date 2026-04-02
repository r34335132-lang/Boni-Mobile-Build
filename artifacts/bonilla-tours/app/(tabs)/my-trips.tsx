import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";
import { BookingCard } from "@/components/BookingCard";
import { Booking, useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function MyTripsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuth();
  const { getUserBookings, getGuestBookings, cancelBooking } = useBooking();

  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestBookings, setGuestBookings] = useState<Booking[] | null>(null);
  const [searching, setSearching] = useState(false);

  const userBookings = user ? getUserBookings(user.id) : [];

  const handleGuestSearch = async () => {
    if (!guestEmail.trim()) {
      Alert.alert("Error", "Ingresa tu email");
      return;
    }
    setSearching(true);
    await new Promise((r) => setTimeout(r, 800));
    const results = getGuestBookings(guestEmail.trim());
    setGuestBookings(results);
    setSearching(false);
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancelar reserva",
      "¿Estás seguro de que deseas cancelar esta reserva?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => {
            cancelBooking(id);
            if (guestBookings) {
              setGuestBookings((prev) =>
                prev
                  ? prev.map((b) =>
                      b.id === id ? { ...b, status: "cancelled" as const } : b
                    )
                  : null
              );
            }
          },
        },
      ]
    );
  };

  if (user) {
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
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            Mis Viajes
          </Text>
        </View>

        {userBookings.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="map" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Sin reservas
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aún no tienes viajes reservados
            </Text>
            <AppButton
              title="Buscar viajes"
              onPress={() => router.navigate("/(tabs)")}
              fullWidth={false}
            />
          </View>
        ) : (
          <FlatList
            data={userBookings}
            keyExtractor={(b) => b.id}
            renderItem={({ item }) => (
              <BookingCard booking={item} onCancel={handleCancel} />
            )}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
      }}
      keyboardShouldPersistTaps="handled"
    >
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
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          Mis Viajes
        </Text>
      </View>

      <View style={styles.guestContainer}>
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: colors.accent,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="info" size={18} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Busca tus reservas con el email con el que reservaste
          </Text>
        </View>

        <View style={styles.guestForm}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            Email con el que reservaste
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.border,
                borderRadius: colors.radius,
                backgroundColor: colors.card,
                color: colors.foreground,
              },
            ]}
            value={guestEmail}
            onChangeText={setGuestEmail}
            placeholder="tu@email.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppButton
            title="Buscar mis reservas"
            onPress={handleGuestSearch}
            loading={searching}
          />
        </View>

        {guestBookings !== null && (
          <View style={styles.results}>
            {guestBookings.length === 0 ? (
              <View style={styles.noResults}>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[styles.noResultsText, { color: colors.mutedForeground }]}>
                  No encontramos reservas con ese email
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
                  {guestBookings.length} reserva{guestBookings.length !== 1 ? "s" : ""} encontrada{guestBookings.length !== 1 ? "s" : ""}
                </Text>
                {guestBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} />
                ))}
              </>
            )}
          </View>
        )}

        <View
          style={[
            styles.convertBox,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="user-plus" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.convertTitle, { color: colors.foreground }]}>
              Crea tu cuenta
            </Text>
            <Text style={[styles.convertText, { color: colors.mutedForeground }]}>
              Gestiona tus viajes más rápido con una cuenta
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={[styles.convertAction, { color: colors.primary }]}>
              Registrarme
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  screenTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center" },
  guestContainer: { padding: 20, gap: 20 },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  infoText: { flex: 1, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  guestForm: { gap: 14 },
  label: { fontSize: 13, fontWeight: "600" },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  results: { gap: 0 },
  resultsTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  noResults: { alignItems: "center", gap: 10, paddingVertical: 20 },
  noResultsText: { fontSize: 14, textAlign: "center" },
  convertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderWidth: 1,
  },
  convertTitle: { fontSize: 14, fontWeight: "700" },
  convertText: { fontSize: 12, marginTop: 2 },
  convertAction: { fontSize: 13, fontWeight: "700" },
});
