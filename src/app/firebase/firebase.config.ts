const FIREBASE_CONFIG = Object.freeze({
  projectId: 'sumerge-todo',
  appId: '1:388405917627:web:36e57ca5dd5d925375769e',
  storageBucket: 'sumerge-todo.firebasestorage.app',
  apiKey: 'AIzaSyBUHqFm6VbtepMhUgsIcI4dBOHAbEj18M4',
  authDomain: 'sumerge-todo.firebaseapp.com',
  messagingSenderId: '388405917627',
  measurementId: 'G-PN3K2JKLVY',
});

export const TODOS_URL =
  `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/todos`;
