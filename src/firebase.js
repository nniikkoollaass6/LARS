import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBFOu29q0JHbXzpSqDkdUI78CUwqCAMp88",
    authDomain: "lars-db2c3.firebaseapp.com",
    databaseURL: "https://lars-db2c3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lars-db2c3",
    storageBucket: "lars-db2c3.appspot.com",
    messagingSenderId: "296596850795",
    appId: "1:296596850795:web:8923de52deaeb0ae2e492e",
    measurementId: "G-CPR08DY84Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export const savePromptToDatabase = (userId, prompt) => {
    const messagesRef = ref(database, `users/${userId}/messages`);
    const newMessageRef = push(messagesRef); // Generates a unique message ID
    set(newMessageRef, prompt); // Saves the prompt as the value of the message ID
};

export const uploadImageToStorage = async (userId, imageFile) => {
    try {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const imageRef = storageRef(storage, `users/${userId}/images/${fileName}`);
        await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL; // Return the image URL for further use
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const fetchComfyUIImages = async () => {
    try {
        const comfyUIRef = storageRef(storage, "ComfyUI/");
        const imageList = await listAll(comfyUIRef);

        const imageUrls = await Promise.all(
          imageList.items.map(async (item) => {
              return await getDownloadURL(item);
          })
        );

        return imageUrls;
    } catch (error) {
        console.error("Error fetching ComfyUI images:", error);
        return [];
    }
};

export { auth, database, storage };

