import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isGuest, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Deseas cerrar tu sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  if (isGuest || !user) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
        }}
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
            Perfil
          </Text>
        </View>

        <View style={styles.guestProfile}>
          <View
            style={[
              styles.avatarLarge,
              { backgroundColor: colors.secondary, borderRadius: 60 },
            ]}
          >
            <Feather name="user" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.guestName, { color: colors.foreground }]}>
            Modo invitado
          </Text>
          <Text style={[styles.guestSub, { color: colors.mutedForeground }]}>
            Estás navegando sin cuenta
          </Text>

          <View
            style={[
              styles.guestCard,
              {
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.guestCardTitle, { color: colors.foreground }]}>
              Ventajas de tener cuenta
            </Text>
            {[
              "Historial de viajes guardado",
              "Datos pre-llenados en checkout",
              "Notificaciones push",
              "Cancelaciones más fáciles",
            ].map((item) => (
              <View key={item} style={styles.benefitRow}>
                <Feather name="check" size={14} color={colors.success} />
                <Text
                  style={[styles.benefitText, { color: colors.mutedForeground }]}
                >
                  {item}
                </Text>
              </View>
            ))}
            <View style={styles.guestActions}>
              <AppButton
                title="Crear cuenta"
                onPress={() => router.push("/(auth)/register")}
              />
              <AppButton
                title="Iniciar sesión"
                onPress={() => router.push("/(auth)/login")}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 80),
      }}
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
          Perfil
        </Text>
        {isAdmin && (
          <View
            style={[
              styles.adminBadge,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius / 2,
              },
            ]}
          >
            <Feather name="shield" size={12} color="#fff" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <View style={styles.profileContent}>
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarLarge,
                {
                  backgroundColor: isAdmin ? colors.primary : colors.secondary,
                  borderRadius: 40,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: isAdmin ? "#fff" : colors.primary }]}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={[styles.profileName, { color: colors.foreground }]}>
                {user.name}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
                {user.email}
              </Text>
              {user.phone && (
                <Text
                  style={[styles.profilePhone, { color: colors.mutedForeground }]}
                >
                  {user.phone}
                </Text>
              )}
            </View>
          </View>

          {[
            { icon: "user", label: "Nombre", value: user.name },
            { icon: "mail", label: "Email", value: user.email },
            { icon: "phone", label: "Teléfono", value: user.phone || "—" },
            { icon: "shield", label: "Rol", value: isAdmin ? "Administrador" : "Cliente" },
          ].map(({ icon, label, value }) => (
            <View
              key={label}
              style={[
                styles.profileField,
                { borderTopColor: colors.border },
              ]}
            >
              <Feather name={icon as any} size={14} color={colors.mutedForeground} />
              <View>
                <Text
                  style={[styles.fieldLabel, { color: colors.mutedForeground }]}
                >
                  {label}
                </Text>
                <Text style={[styles.fieldValue, { color: colors.foreground }]}>
                  {value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <AppButton
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="danger"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    flex: 1,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  adminBadgeText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  profileContent: { padding: 20, gap: 16 },
  profileCard: {
    padding: 16,
    borderWidth: 1,
    gap: 0,
    overflow: "hidden",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "800" },
  profileMeta: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: "700" },
  profileEmail: { fontSize: 13, marginTop: 2 },
  profilePhone: { fontSize: 13, marginTop: 1 },
  profileField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  fieldLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  fieldValue: { fontSize: 14, fontWeight: "600", marginTop: 1 },
  guestProfile: { alignItems: "center", padding: 24, gap: 12 },
  guestName: { fontSize: 22, fontWeight: "800" },
  guestSub: { fontSize: 14 },
  guestCard: { width: "100%", padding: 20, borderWidth: 1, gap: 12, marginTop: 8 },
  guestCardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  benefitText: { fontSize: 14 },
  guestActions: { gap: 10, marginTop: 8 },
  logoutSection: { marginTop: 8 },
});
