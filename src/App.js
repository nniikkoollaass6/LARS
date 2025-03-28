import React, { useState, useEffect } from 'react';
import { signUp, signIn } from './auth.js';
import { savePromptToDatabase, uploadImageToStorage, fetchComfyUIImages } from './firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './LARS.css';

const auth = getAuth();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserId(user.uid);
            } else {
                setIsLoggedIn(false);
                setUserId(null);
            }
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchLatestGeneratedImage();
        }
    }, [isLoggedIn]);

    const fetchLatestGeneratedImage = async () => {
        const images = await fetchComfyUIImages();
        if (images.length > 0) {
            setGeneratedImage(images[images.length - 1]);
        }
    };

    const handleSignUp = async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            await signUp(email, password);
            alert("User signed up successfully!");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSignIn = async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            await signIn(email, password);
            alert("User signed in successfully!");
            setIsLoggedIn(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImage(file);
        const url = await uploadImageToStorage(userId, file);
        if (url) {
            setImageURL(url);
            alert("Image uploaded successfully!");
        } else {
            alert("Image upload failed.");
        }
    };

    const handleGenerate = async () => {
        if (!userId) {
            alert("You must be logged in to generate and save prompts.");
            return;
        }
        if (prompt.trim() === "") {
            alert("Please enter a prompt before generating.");
            return;
        }

        savePromptToDatabase(userId, prompt);
        alert("Prompt sent to AI PC. Please wait for the generated image.");

        setTimeout(fetchLatestGeneratedImage, 10000);
        setPrompt("");
    };

    return (
      <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
          <header>
              <h1>LARS</h1>
              <p>Linux-based Art Rendering System</p>
              <button id="modeSwitch" onClick={toggleMode}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
          </header>

          <section id="auth" style={{ display: isLoggedIn ? 'none' : 'block' }}>
              <div className="auth-box">
                  <h2>Login</h2>
                  <input type="email" id="email" placeholder="E-Mail" />
                  <input type="password" id="password" placeholder="Password" />
                  <button onClick={handleSignIn}>Log in</button>
                  <button onClick={handleSignUp}>Register</button>
              </div>
          </section>

          <section id="main" style={{ display: isLoggedIn ? 'block' : 'none' }}>
              <h2>Generate AI Images</h2>
              <textarea
                id="prompt"
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
              <button id="generate" onClick={handleGenerate}>Generate</button>

              <input type="file" accept="image/*" onChange={handleImageUpload} />

              {imageURL && <img src={imageURL} alt="Uploaded AI Art" style={{ width: "300px", marginTop: "10px" }} />}

              {generatedImage && (
                <div className="image-container">
                    <h3>Generated Image:</h3>
                    <img src={generatedImage} alt="Generated AI Art" style={{ width: "300px", marginTop: "10px" }} />
                    <br />
                    <a href={generatedImage} download="generated-image.jpg">
                        <button>Download Image</button>
                    </a>
                </div>
              )}

              <button id="logout" onClick={() => setIsLoggedIn(false)}>Logout</button>
          </section>

          <footer>
              <p>Contact: vaclavnikolas9@gmail.com | +421915122847</p>
          </footer>
      </div>
    );
}

export default App;
