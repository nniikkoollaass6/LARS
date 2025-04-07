import React, { useState, useEffect } from 'react';
import { signUp, signIn } from './auth.js';
import { savePromptToDatabase, fetchLatestComfyUIImage } from './firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './LARS.css';

const auth = getAuth();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [latestImageURL, setLatestImageURL] = useState("");

    // Check user authentication status
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserId(user.uid);
                fetchAndSetLatestImage();
            } else {
                setIsLoggedIn(false);
                setUserId(null);
            }
        });
    }, []);

    // Sign up function
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

    // Sign in function
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

    // Toggle dark/light mode
    const toggleMode = () => setIsDarkMode(!isDarkMode);

    // Handle prompt generation
    const handleGenerate = async () => {
        if (!userId) return alert("You must be logged in.");
        if (!prompt.trim()) return alert("Enter a prompt.");

        await savePromptToDatabase(userId, prompt);
        setPrompt("");
        alert("Prompt sent to AI PC.");

        // Delay and then refresh the image
        setTimeout(fetchAndSetLatestImage, 6000); // adjust this timing based on how fast your AI PC responds
    };

    // Fetch the latest image from Firebase Storage
    const fetchAndSetLatestImage = async () => {
        const url = await fetchLatestComfyUIImage();
        if (url) {
            console.log("Fetched Image URL:", url);  // Log the URL
            setLatestImageURL(url);
        } else {
            console.log("No image URL fetched.");
            setLatestImageURL("");
        }
    };


    return (
      <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
          <header>
              <h1>LARS</h1>
              <p>Linux-based Art Rendering System</p>
              <button onClick={toggleMode}>
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
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></textarea>
              <button onClick={handleGenerate}>Generate</button>

              {latestImageURL ? (
                <div style={{ marginTop: "20px" }}>
                    <h3>Latest Generated Image</h3>
                    <img src={latestImageURL} alt="Generated AI" style={{ width: "300px" }} />
                    <br />
                    <a href={latestImageURL} download target="_blank" rel="noreferrer">
                        Download Image
                    </a>
                </div>
              ) : (
                <p>No image available yet.</p>
              )}

              <button onClick={() => setIsLoggedIn(false)}>Logout</button>
          </section>

          <footer>
              <p>Contact: vaclavnikolas9@gmail.com | +421915122847</p>
          </footer>
      </div>
    );
}

export default App;
