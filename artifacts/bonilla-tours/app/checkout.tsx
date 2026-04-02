import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/contexts/BookingContext";
import { useColors } from "@/hooks/useColors";

type PaymentMethod = "card" | "cash";

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isGuest, guestInfo, setGuestInfo } = useAuth();
  const { pendingTrip, pendingSeats, confirmBooking } = useBooking();

  const [name, setName] = useState(
    user?.name ?? guestInfo?.name ?? ""
  );
  const [email, setEmail] = useState(
    user?.email ?? guestInfo?.email ?? ""
  );
  const [phone, setPhone] = useState(
    user?.phone ?? guestInfo?.phone ?? ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!pendingTrip || pendingSeats.length === 0) {
    router.back();
    return null;
  }

  const totalPrice = pendingSeats.length * pendingTrip.price;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nombre requerido";
    if (!email.trim()) e.email = "Email requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Email inválido";
    if (!phone.trim()) e.phone = "Teléfono requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setLoading(true);

    if (isGuest) {
      setGuestInfo({ name, email, phone });
    }

    try {
      const booking = await confirmBooking({
        trip: pendingTrip,
        seats: pendingSeats,
        passengerName: name,
        passengerEmail: email,
        passengerPhone: phone,
        paymentMethod,
        status: "confirmed",
        userId: user?.id ?? null,
        isGuest: !user,
        totalPrice,
      });

      router.replace({
        pathname: "/booking-success",
        params: { bookingId: booking.id, bookingData: JSON.stringify(booking) },
      });
    } catch {
      Alert.alert("Error", "No se pudo procesar tu reserva. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Confirmar reserva
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Section title="Tu viaje" colors={colors}>
          <View style={styles.tripSummary}>
            <View style={styles.tripRow}>
              <Feather name="map-pin" size={16} color={colors.primary} />
              <Text style={[styles.tripText, { color: colors.foreground }]}>
                {pendingTrip.origin} → {pendingTrip.destination}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <Feather name="clock" size={16} color={colors.mutedForeground} />
              <Text style={[styles.tripSub, { color: colors.mutedForeground }]}>
                {pendingTrip.date} · {pendingTrip.departureTime} – {pendingTrip.arrivalTime}
              </Text>
            </View>
            <View style={styles.tripRow}>
              <Feather name="grid" size={16} color={colors.mutedForeground} />
              <Text style={[styles.tripSub, { color: colors.mutedForeground }]}>
                Asientos: {pendingSeats.sort((a, b) => a - b).join(", ")}
              </Text>
            </View>
          </View>
          <View
            style={[styles.priceRow, { borderTopColor: colors.border }]}
          >
            <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
              Total ({pendingSeats.length} asiento{pendingSeats.length !== 1 ? "s" : ""})
            </Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>
              ${totalPrice} MXN
            </Text>
          </View>
        </Section>

        <Section
          title="Datos del pasajero"
          subtitle={user ? "Datos pre-llenados de tu cuenta" : "Requerido para tu reserva"}
          colors={colors}
        >
          {user && (
            <View
              style={[
                styles.autofillBanner,
                { backgroundColor: colors.secondary, borderRadius: colors.radius / 2 },
              ]}
            >
              <Feather name="user-check" size={14} color={colors.primary} />
              <Text style={[styles.autofillText, { color: colors.primary }]}>
                Datos de tu cuenta aplicados automáticamente
              </Text>
            </View>
          )}

          <FormField
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            error={errors.name}
            placeholder="Tu nombre completo"
            colors={colors}
          />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            colors={colors}
          />
          <FormField
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            placeholder="+52 618 000 0000"
            keyboardType="phone-pad"
            colors={colors}
          />
        </Section>

        <Section title="Método de pago" colors={colors}>
          {(["card", "cash"] as PaymentMethod[]).map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                {
                  backgroundColor:
                    paymentMethod === method ? colors.secondary : colors.muted,
                  borderColor:
                    paymentMethod === method ? colors.primary : colors.border,
                  borderRadius: colors.radius,
                },
              ]}
              onPress={() => setPaymentMethod(method)}
              activeOpacity={0.7}
            >
              <Feather
                name={method === "card" ? "credit-card" : "dollar-sign"}
                size={20}
                color={
                  paymentMethod === method ? colors.primary : colors.mutedForeground
                }
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.paymentTitle,
                    {
                      color:
                        paymentMethod === method
                          ? colors.primary
                          : colors.foreground,
                    },
                  ]}
                >
                  {method === "card" ? "Tarjeta" : "Efectivo"}
                </Text>
                <Text
                  style={[styles.paymentSub, { color: colors.mutedForeground }]}
                >
                  {method === "card"
                    ? "Pago seguro con tarjeta de crédito/débito"
                    : "Reserva con pago en taquilla antes de abordar"}
                </Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor:
                      paymentMethod === method ? colors.primary : colors.border,
                  },
                ]}
              >
                {paymentMethod === method && (
                  <View
                    style={[
                      styles.radioFill,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {paymentMethod === "card" && (
            <View
              style={[
                styles.cardNotice,
                {
                  backgroundColor: colors.muted,
                  borderRadius: colors.radius / 2,
                },
              ]}
            >
              <Feather name="lock" size={13} color={colors.mutedForeground} />
              <Text style={[styles.cardNoticeText, { color: colors.mutedForeground }]}>
                Pago procesado de forma segura (Demo: no se realiza cargo real)
              </Text>
            </View>
          )}
        </Section>

        <AppButton
          title="Confirmar Reserva"
          onPress={handleConfirm}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Section({
  title,
  subtitle,
  children,
  colors,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={[styles.sectionContent, { borderTopColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType,
  autoCapitalize,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  colors: any;
}) {
  return (
    <View>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.destructive : colors.border,
            borderRadius: colors.radius / 1.5,
            backgroundColor: colors.background,
            color: colors.foreground,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "words"}
        autoCorrect={false}
      />
      {error && (
        <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scroll: { padding: 16, gap: 14 },
  tripSummary: { gap: 8 },
  tripRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tripText: { fontSize: 15, fontWeight: "700" },
  tripSub: { fontSize: 13 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: 14, fontWeight: "500" },
  priceValue: { fontSize: 22, fontWeight: "800" },
  autofillBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    marginBottom: 12,
  },
  autofillText: { fontSize: 12, fontWeight: "600", flex: 1 },
  section: { borderWidth: 1, overflow: "hidden" },
  sectionHeader: { padding: 14 },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  sectionSub: { fontSize: 12, marginTop: 2 },
  sectionContent: { borderTopWidth: 1, padding: 14, gap: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  error: { fontSize: 12, marginTop: 4, fontWeight: "500" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1.5,
  },
  paymentTitle: { fontSize: 14, fontWeight: "700" },
  paymentSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioFill: { width: 10, height: 10, borderRadius: 5 },
  cardNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  cardNoticeText: { fontSize: 12, flex: 1, lineHeight: 16 },
});
