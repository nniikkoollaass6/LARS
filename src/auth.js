import { auth } from './firebase.js'; // Assuming you have firebase initialized here
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

