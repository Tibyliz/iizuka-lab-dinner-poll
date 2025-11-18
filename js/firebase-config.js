/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Go to Project Settings > General
 * 4. Scroll to "Your apps" > Web app
 * 5. Copy the firebaseConfig object
 * 6. Paste it below, replacing the placeholder
 */

// ⚠️ REPLACE THIS WITH YOUR FIREBASE CONFIG
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaqLT-f7kB9j4K-1zefvbRwtiUT2nieyw",
  authDomain: "iizuka-lab-poll.firebaseapp.com",
  databaseURL: "https://iizuka-lab-poll-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iizuka-lab-poll",
  storageBucket: "iizuka-lab-poll.firebasestorage.app",
  messagingSenderId: "1024273694514",
  appId: "1:1024273694514:web:2c3660e171b180f283a12b",
  measurementId: "G-MTG8449Q55"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

// Export for use in other files
window.db = database;

console.log('✅ Firebase initialized successfully!');
