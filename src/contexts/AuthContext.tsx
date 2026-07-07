import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChangedListener,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  logout,
  getOrCreateUserDocument,
  addFavoriteToUser,
  removeFavoriteFromUser,
  type AuthUser,
} from "../services/authService";

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (rpgId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const authUser = await getOrCreateUserDocument(firebaseUser);
          setUser(authUser);
        } catch (error) {
          console.error("Falha ao criar/recuperar usuário Firestore:", error);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || null,
            email: firebaseUser.email || null,
            photoURL: firebaseUser.photoURL || null,
            createdAt: null,
            favorites: [],
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInGoogle = async () => {
    setLoading(true);
    try {
      const authenticatedUser = await signInWithGoogle();
      setUser(authenticatedUser);
    } finally {
      setLoading(false);
    }
  };

  const signInEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authenticatedUser = await signInWithEmail(email, password);
      setUser(authenticatedUser);
    } finally {
      setLoading(false);
    }
  };

  const registerEmail = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const authenticatedUser = await registerWithEmail(name, email, password);
      setUser(authenticatedUser);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (rpgId: number) => {
    if (!user) return;
    const favoriteId = String(rpgId);
    const alreadyFavorite = user.favorites.includes(favoriteId);
    if (alreadyFavorite) {
      await removeFavoriteFromUser(user.uid, favoriteId);
      setUser({ ...user, favorites: user.favorites.filter((id) => id !== favoriteId) });
    } else {
      await addFavoriteToUser(user.uid, favoriteId);
      setUser({ ...user, favorites: [...user.favorites, favoriteId] });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle: signInGoogle,
        signInWithEmail: signInEmail,
        registerWithEmail: registerEmail,
        logout: logoutUser,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
