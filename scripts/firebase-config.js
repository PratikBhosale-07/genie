// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8sON5l-h7mSe0fhbrt6IVSurVHJ7fYWI",
  authDomain: "genie-ai-0-b1901.firebaseapp.com",
  projectId: "genie-ai-0-b1901",
  storageBucket: "genie-ai-0-b1901.appspot.com",
  messagingSenderId: "383136107116",
  appId: "1:383136107116:web:757341d79ae2c4766be649",
  measurementId: "G-NP310B0PLZ"
};

// Initialize Firebase - making variables accessible globally
// Using the compat version for backward compatibility
try {
  // Check if Firebase is already initialized to prevent multiple initializations
  if (typeof firebase === 'undefined') {
    console.error("Firebase SDK not loaded. Please include the Firebase SDK scripts.");
  } else if (!firebase.apps || !firebase.apps.length) {
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } else {
    window.firebaseApp = firebase.app(); // Use existing app if already initialized
    console.log("Using existing Firebase app");
  }
  
  // Initialize Firebase services
  if (typeof firebase !== 'undefined') {
    window.auth = firebase.auth();
    // Only initialize analytics if it exists (it doesn't in some environments)
    if (firebase.analytics) {
      window.analytics = firebase.analytics();
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Authentication helper functions with proper promise handling
const authHelpers = {
  // Sign in with email and password
  signInWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Login successful");
        return userCredential.user;
      })
      .catch((error) => {
        console.error("Login error:", error.code, error.message);
        throw error; // Re-throw to allow handling by the caller
      });
  },
  
  // Create new account with email and password
  createAccount: (email, password, displayName) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Update profile with display name if provided
        if (displayName) {
          return user.updateProfile({
            displayName: displayName
          }).then(() => {
            console.log("User profile updated with display name");
            return user;
          });
        }
        return user;
      })
      .catch((error) => {
        console.error("Signup error:", error.code, error.message);
        throw error; // Re-throw to allow handling by the caller
      });
  },
  
  // Sign in with Google
  signInWithGoogle: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        console.log("Google sign-in successful");
        return result.user;
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        throw error; // Re-throw to allow handling by the caller
      });
  },
  
  // Send password reset email
  resetPassword: (email) => {
    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        console.log("Password reset email sent");
        return true;
      })
      .catch((error) => {
        console.error("Password reset error:", error);
        throw error; // Re-throw to allow handling by the caller
      });
  },
  
  // Sign out current user
  signOut: () => {
    return firebase.auth().signOut()
      .then(() => {
        console.log("User signed out successfully");
        return true;
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        throw error; // Re-throw to allow handling by the caller
      });
  },
  
  // Get current user
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  
  // Listen for auth state changes
  onAuthStateChanged: (callback) => {
    return firebase.auth().onAuthStateChanged(callback);
  }
};

// Expose auth helpers globally
window.authHelpers = authHelpers;

// Function to test login functionality with proper promise handling
window.testLoginProcess = function(email, password) {
  console.log("Testing login process...");
  
  return new Promise((resolve) => {
    // First check current auth state
    const currentUser = firebase.auth().currentUser;
    
    if (currentUser) {
      console.log("User is already logged in:", currentUser.email);
      resolve(currentUser);
      return;
    }
    
    console.log("No user is currently logged in. Attempting login...");
    
    // Attempt to login with provided credentials
    if (email && password) {
      authHelpers.signInWithEmail(email, password)
        .then((user) => {
          console.log("Login successful:", user.email);
          resolve(user);
        })
        .catch((error) => {
          console.error("Login failed:", error.code, error.message);
          resolve(null);
        });
    } else {
      console.log("No credentials provided for test login");
      resolve(null);
    }
  });
};

// Improved auth state check function
window.checkAuthState = function() {
  console.log("Checking authentication state...");
  
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe once we get the initial state
      if (user) {
        console.log("User is signed in:", user.email);
        resolve(user);
      } else {
        console.log("No user is signed in");
        resolve(null);
      }
    });
  });
};