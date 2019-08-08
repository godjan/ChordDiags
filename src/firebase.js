import { initializeApp } from 'firebase';

const app = initializeApp({
    apiKey: "AIzaSyAJMK-hjtmaNx9fIYUeKftJeJcEAUjHmiE",
    authDomain: "tedgreene-diagrams.firebaseapp.com",
    databaseURL: "https://tedgreene-diagrams.firebaseio.com",
    projectId: "tedgreene-diagrams",
    storageBucket: "tedgreene-diagrams.appspot.com",
    messagingSenderId: "284562345798"
  });

 const db = app.database();

 export default db.ref('chords');    

// export default function sayHello() { console.log('hello')}

