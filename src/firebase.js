import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBFOu29q0JHbXzpSqDkdUI78CUwqCAMp88",
    authDomain: "lars-db2c3.firebaseapp.com",
    databaseURL: "https://lars-db2c3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lars-db2c3",
    storageBucket: "gs://lars-db2c3.firebasestorage.app",
    messagingSenderId: "296596850795",
    appId: "1:296596850795:web:8923de52deaeb0ae2e492e",
    measurementId: "G-CPR08DY84Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Save the user's prompt to the database
export const savePromptToDatabase = (userId, prompt) => {
    const messagesRef = ref(database, `users/${userId}/messages`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, prompt);
};

// Fetch the latest image from the ComfyUI folder
export const fetchLatestComfyUIImage = async () => {
    try {
        const comfyUIRef = storageRef(storage, "ComfyUI/");
        const result = await listAll(comfyUIRef);
        if (!result.items.length) {
            console.log("No items found in ComfyUI folder.");
            return null;
        }

        console.log("Items found in ComfyUI:", result.items.map(item => item.name));

        // Sort items by the timestamp from the filename (if the name follows the pattern you mentioned)
        const sortedItems = result.items.sort((a, b) => {
            const aTime = parseInt(a.name.split('_')[1]);
            const bTime = parseInt(b.name.split('_')[1]);
            return bTime - aTime;
        });

        const latestItem = sortedItems[0];
        console.log("Latest Item:", latestItem.name);

        const downloadURL = await getDownloadURL(latestItem);
        console.log("Download URL:", downloadURL);

        return downloadURL;
    } catch (error) {
        console.error("Error fetching ComfyUI image:", error);
        return null;
    }
};


export { auth, database, storage };
