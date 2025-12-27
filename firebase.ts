
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA7gHHV6qxnforZSIZVlHe6xg2YgwA8ecA",
  authDomain: "quiz-app-96668.firebaseapp.com",
  projectId: "quiz-app-96668",
  storageBucket: "quiz-app-96668.firebasestorage.app",
  messagingSenderId: "249741260260",
  appId: "1:249741260260:web:d7f75293d84c44b02fc3f1",
  measurementId: "G-SZYV2HVLVE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const saveQuizResult = async (data: {
  name: string;
  email: string;
  score: number;
  totalQuestions: number;
  ip: string;
  percentage?: number;
}) => {
  try {
    const payload = {
      ...data,
      percentage: data.percentage ?? Math.round((data.score / data.totalQuestions) * 100),
      timestamp: serverTimestamp(),
    } as any;

    // Log what we are saving (appears in the browser console during development)
    console.log('Saving quiz result to Firestore:', payload);

    const docRef = await addDoc(collection(db, "submissions"), payload);

    console.log('Saved quiz result docId:', docRef.id);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error saving result: ", error);
    throw error;
  }
};

export const checkEmailSubmitted = async (email: string): Promise<boolean> => {
  const q = query(
    collection(db, "submissions"),
    where("email", "==", email),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const authSignIn = async (email: string, password: string): Promise<User> => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const authSignUp = async (email: string, password: string): Promise<User> => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const authSignOut = async () => {
  await firebaseSignOut(auth);
};

export const onAuthChanged = (cb: (u: User | null) => void) => {
  return onAuthStateChanged(auth, cb);
};

export const checkIpLockout = async (ip: string, lockoutDuration: number): Promise<boolean> => {
  const q = query(
    collection(db, "submissions"),
    where("ip", "==", ip),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return false;

  const lastSubmission = querySnapshot.docs[0].data();
  if (!lastSubmission.timestamp) return false;

  const lastTime = lastSubmission.timestamp.toMillis();
  const currentTime = Date.now();
  
  return (currentTime - lastTime) < lockoutDuration;
};

export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to fetch IP", error);
    return 'unknown-ip';
  }
};
