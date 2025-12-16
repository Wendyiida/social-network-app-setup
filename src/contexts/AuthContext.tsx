
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types/profile';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendPhoneVerification: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  createUserProfile: (userId: string, profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // Create user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      displayName,
      email,
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendPhoneVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
    await confirmationResult.confirm(code);
  };

  const createUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: userId,
      displayName: profileData.displayName || '',
      email: profileData.email || null,
      phoneNumber: profileData.phoneNumber || null,
      photoURL: profileData.photoURL || null,
      bio: profileData.bio || null,
      locationPrivacy: profileData.locationPrivacy || 'nobody',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', userId), newProfile);
    setUserProfile(newProfile);
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const updatedProfile = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true });
    
    // Update local state
    setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);

    // Update Firebase Auth profile if displayName or photoURL changed
    if (profileData.displayName || profileData.photoURL) {
      await updateProfile(user, {
        displayName: profileData.displayName || user.displayName,
        photoURL: profileData.photoURL || user.photoURL,
      });
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    sendPhoneVerification,
    verifyPhoneCode,
    updateUserProfile,
    createUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}