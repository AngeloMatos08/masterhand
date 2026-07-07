import {
  type User,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const googleProvider = new GoogleAuthProvider();

type AuthUser = {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Date | null;
  favorites: string[];
};

function mapUserToAuthUser(user: User, favoriteIds: string[], fallbackDate: Date | null = null): AuthUser {
  return {
    uid: user.uid,
    name: user.displayName || null,
    email: user.email || null,
    photoURL: user.photoURL || null,
    createdAt: fallbackDate,
    favorites: favoriteIds,
  };
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithPopup(auth, googleProvider);
  return await getOrCreateUserDocument(result.user);
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  return await getOrCreateUserDocument(result.user);
}

export async function registerWithEmail(
  displayName: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (result.user) {
    await updateProfile(result.user, { displayName });
  }

  return await getOrCreateUserDocument(result.user);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthStateChangedListener(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getOrCreateUserDocument(user: User): Promise<AuthUser> {
  const userRef = doc(db, "usuarios", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    console.log("Firestore: criando documento de usuário", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
    });
  }

  const favoritesCollection = collection(userRef, "favoritos");
  const favoritesSnapshot = await getDocs(favoritesCollection);
  const favoriteIds = favoritesSnapshot.docs.map((favoriteDoc) => favoriteDoc.id);

  return mapUserToAuthUser(
    user,
    favoriteIds,
    snapshot.exists() ? snapshot.data()?.createdAt?.toDate?.() ?? new Date() : new Date(),
  );
}

export async function addFavoriteToUser(userId: string, rpgId: string) {
  const favoriteRef = doc(db, "usuarios", userId, "favoritos", rpgId);
  console.log("Firestore: adicionando favorito", { userId, rpgId });
  await setDoc(favoriteRef, { addedAt: serverTimestamp() });
}

export async function removeFavoriteFromUser(userId: string, rpgId: string) {
  const favoriteRef = doc(db, "usuarios", userId, "favoritos", rpgId);
  console.log("Firestore: removendo favorito", { userId, rpgId });
  await deleteDoc(favoriteRef);
}

export type { AuthUser };
