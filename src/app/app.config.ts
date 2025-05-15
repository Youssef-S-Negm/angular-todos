import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'sumerge-todo',
        appId: '1:388405917627:web:36e57ca5dd5d925375769e',
        storageBucket: 'sumerge-todo.firebasestorage.app',
        apiKey: 'AIzaSyBUHqFm6VbtepMhUgsIcI4dBOHAbEj18M4',
        authDomain: 'sumerge-todo.firebaseapp.com',
        messagingSenderId: '388405917627',
        measurementId: 'G-PN3K2JKLVY',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
