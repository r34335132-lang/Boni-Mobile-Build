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
import { useColors } from "@/hooks/useColors";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!form.email.trim()) e.email = "Email requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim()) e.phone = "Teléfono requerido";
    if (!form.password) e.password = "Contraseña requerida";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 24,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 24),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Crear Cuenta
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Únete para gestionar tus viajes
        </Text>

        <View style={styles.form}>
          {[
            { key: "name", label: "Nombre completo", placeholder: "Tu nombre", type: "default" },
            { key: "email", label: "Email", placeholder: "tu@email.com", type: "email-address" },
            { key: "phone", label: "Teléfono", placeholder: "+52 618 000 0000", type: "phone-pad" },
          ].map(({ key, label, placeholder, type }) => (
            <View key={key}>
              <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    borderColor: errors[key] ? colors.destructive : colors.border,
                    borderRadius: colors.radius,
                    backgroundColor: colors.card,
                  },
                ]}
                value={form[key as keyof typeof form]}
                onChangeText={(v) => update(key as keyof typeof form, v)}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                keyboardType={type as any}
                autoCapitalize={type === "email-address" ? "none" : "words"}
                autoCorrect={false}
              />
              {errors[key] && (
                <Text style={[styles.error, { color: colors.destructive }]}>
                  {errors[key]}
                </Text>
              )}
            </View>
          ))}

          {["password", "confirmPassword"].map((key) => (
            <View key={key}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                {key === "password" ? "Contraseña" : "Confirmar contraseña"}
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    borderColor: errors[key] ? colors.destructive : colors.border,
                    borderRadius: colors.radius,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <TextInput
                  style={[styles.inputInner, { color: colors.foreground }]}
                  value={form[key as keyof typeof form]}
                  onChangeText={(v) => update(key as keyof typeof form, v)}
                  placeholder={key === "password" ? "Mínimo 6 caracteres" : "Repite tu contraseña"}
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                />
                {key === "confirmPassword" && (
                  <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                    <Feather
                      name={showPwd ? "eye-off" : "eye"}
                      size={18}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {errors[key] && (
                <Text style={[styles.error, { color: colors.destructive }]}>
                  {errors[key]}
                </Text>
              )}
            </View>
          ))}
        </View>

        <AppButton
          title="Crear Cuenta"
          onPress={handleRegister}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            ¿Ya tienes cuenta?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={[styles.link, { color: colors.primary }]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  backBtn: { marginBottom: 24, alignSelf: "flex-start" },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 6, marginBottom: 28 },
  form: { gap: 16, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  inputInner: { flex: 1, fontSize: 15 },
  error: { fontSize: 12, marginTop: 4, fontWeight: "500" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: "700" },
});
