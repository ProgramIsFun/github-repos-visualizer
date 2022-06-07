import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/firestore';
/**
 * Creates and initializes a Firebase app.
 */


// replace WITH ur own config!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const app = firebase.initializeApp( {
  apiKey: "AIzaSyCKWDz21AAAAAAAAAAAAb4lgerTXFGG_s",
  authDomain: "giDDDDDDDDD9a8.firebaseapp.com",
  projectId: "gitAAAAAAl-7d9a8",
  storageBucket: "gitvisFFFFFFFFFFFt.com",
  messagingSenderId: "214GGGGGGGGGGGG8192",
  appId: "1:214955588192:web:435daASDAbd72df56105",
  measurementId: "G-CPLHASDCQ"
});

export default app;
export const dbbbbb = firebase.firestore();


export const auth = firebase.auth