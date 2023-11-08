import firebase from 'firebase/compat/app';
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbpkf3xaqyl-EikSx7iWcVkXUWQLhJ1hU",
  authDomain: "upimg-7e515.firebaseapp.com",
  projectId: "upimg-7e515",
  storageBucket: "upimg-7e515.appspot.com",
  messagingSenderId: "670075319769",
  appId: "1:670075319769:web:c99988a45755fd38bcd5c8"
};

// Initialize Firebase
firebase.apps && !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : "";

export const FirebaseStorage = firebase.storage();
export default firebase;
