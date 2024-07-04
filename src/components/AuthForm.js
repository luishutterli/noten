import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css"

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) navigate("/");
    });
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up successfully");
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMessage(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Signed in with Google");
    } catch (error) {
      console.error("Google sign in error:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-full max-w-xs">
        <button onClick={handleGoogleLogin} className="w-full mb-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
          Login with Google
        </button>
        {isLogin ? (
          <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-6">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Login
              </button>
              <button type="button" onClick={() => setIsLogin(false)} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 focus:outline-none">
                Switch to Sign Up
              </button>
            </div>
            {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="mb-6">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Sign Up
              </button>
              <button type="button" onClick={() => setIsLogin(true)} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 focus:outline-none">
                Switch to Login
              </button>
            </div>
            {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForms;