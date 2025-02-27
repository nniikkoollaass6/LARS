// auth.js
import { auth } from './firebase.js'; // Assuming you have firebase initialized here
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Function to sign up
export async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// Function to sign in
export async function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

