import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBFOu29q0JHbXzpSqDkdUI78CUwqCAMp88",
    authDomain: "lars-db2c3.firebaseapp.com",
    databaseURL: "https://lars-db2c3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lars-db2c3",
    storageBucket: "lars-db2c3.firebasestorage.app",
    messagingSenderId: "296596850795",
    appId: "1:296596850795:web:8923de52deaeb0ae2e492e",
    measurementId: "G-CPR08DY84Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export const savePromptToDatabase = (prompt) => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid; // Get user ID
        const userPromptsRef = ref(database, `users/${userId}/prompts`);
        const newPromptRef = push(userPromptsRef); // Create a unique prompt ID
        set(newPromptRef, {
            text: prompt,
            timestamp: Date.now()
        });
    } else {
        alert("You must be logged in to save prompts.");
    }
};

export { auth, database };
