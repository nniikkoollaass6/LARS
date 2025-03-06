import React, { useState, useEffect } from 'react';
import { signUp, signIn } from './auth.js';
import { savePromptToDatabase } from './firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './LARS.css';

const auth = getAuth();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
    }, []);

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

    // Handle Generate Button Click - Save to Firebase
    const handleGenerate = () => {
        if (prompt.trim() === "") {
            alert("Please enter a prompt before generating.");
            return;
        }

        savePromptToDatabase(prompt);
        alert("Prompt saved successfully!");

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

            {/* Authentication */}
            <section id="auth" style={{ display: isLoggedIn ? 'none' : 'block' }}>
                <div className="auth-box">
                    <h2>Login</h2>
                    <input type="email" id="email" placeholder="E-Mail" />
                    <input type="password" id="password" placeholder="Password" />
                    <button onClick={handleSignIn}>Log in</button>
                    <button onClick={handleSignUp}>Register</button>
                </div>
            </section>

            {/* AI Generation */}
            <section id="main" style={{ display: isLoggedIn ? 'block' : 'none' }}>
                <h2>Generate AI Images</h2>
                <textarea
                    id="prompt"
                    placeholder="Enter your prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button id="generate" onClick={handleGenerate}>Generate</button>
                <div id="imageDisplay"></div>
                <button id="logout" onClick={() => setIsLoggedIn(false)}>Logout</button>
            </section>

            <footer>
                <p>Contact: vaclavnikolas9@gmail.com | +421915122847</p>
            </footer>
        </div>
    );
}

export default App;
