import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  guestInfo: GuestInfo | null;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  setGuestInfo: (info: GuestInfo) => void;
  convertGuestToUser: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY_USER = "bonilla_user";
const STORAGE_KEY_GUEST = "bonilla_guest";

const MOCK_ADMIN: User = {
  id: "admin_001",
  name: "Admin Bonilla",
  email: "admin@bonillatours.mx",
  phone: "+52 618 000 0001",
  role: "admin",
};

const MOCK_CUSTOMERS: User[] = [
  {
    id: "user_001",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    phone: "+52 618 123 4567",
    role: "customer",
  },
  {
    id: "user_002",
    name: "Maria García",
    email: "maria@example.com",
    phone: "+52 618 987 6543",
    role: "customer",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guestInfo, setGuestInfoState] = useState<GuestInfo | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedGuest] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_USER),
          AsyncStorage.getItem(STORAGE_KEY_GUEST),
        ]);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (storedGuest) {
          setGuestInfoState(JSON.parse(storedGuest));
          setIsGuest(true);
        }
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const normalizedEmail = email.toLowerCase().trim();
    let found: User | undefined;
    if (normalizedEmail === MOCK_ADMIN.email) {
      found = MOCK_ADMIN;
    } else {
      found = MOCK_CUSTOMERS.find((u) => u.email === normalizedEmail);
    }
    if (!found) {
      found = {
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email: normalizedEmail,
        phone: "",
        role: "customer",
      };
    }
    await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(found));
    await AsyncStorage.removeItem(STORAGE_KEY_GUEST);
    setUser(found);
    setIsGuest(false);
    setGuestInfoState(null);
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      const newUser: User = {
        id: "user_" + Date.now(),
        name,
        email: email.toLowerCase().trim(),
        phone,
        role: "customer",
      };
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      await AsyncStorage.removeItem(STORAGE_KEY_GUEST);
      setUser(newUser);
      setIsGuest(false);
      setGuestInfoState(null);
    },
    []
  );

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEY_USER, STORAGE_KEY_GUEST]);
    setUser(null);
    setGuestInfoState(null);
    setIsGuest(false);
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    setUser(null);
  }, []);

  const setGuestInfo = useCallback((info: GuestInfo) => {
    setGuestInfoState(info);
    AsyncStorage.setItem(STORAGE_KEY_GUEST, JSON.stringify(info));
  }, []);

  const convertGuestToUser = useCallback(
    async (_password: string) => {
      if (!guestInfo) return;
      const newUser: User = {
        id: "user_" + Date.now(),
        name: guestInfo.name,
        email: guestInfo.email,
        phone: guestInfo.phone,
        role: "customer",
      };
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      await AsyncStorage.removeItem(STORAGE_KEY_GUEST);
      setUser(newUser);
      setIsGuest(false);
      setGuestInfoState(null);
    },
    [guestInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        guestInfo,
        isGuest,
        isLoading,
        login,
        register,
        logout,
        continueAsGuest,
        setGuestInfo,
        convertGuestToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
