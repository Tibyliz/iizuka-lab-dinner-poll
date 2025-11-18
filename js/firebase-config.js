// Firebase Configuration
// Replace with your Firebase project config

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

// Get a reference to the database service
const database = firebase.database();

console.log('[Firebase] Initialized successfully');
