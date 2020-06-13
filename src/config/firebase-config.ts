import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDtQ4fm9ITbl_6BIwgra5yD_f7EkMQ6Glk',
  authDomain: 'train-together-ec92b.firebaseapp.com',
  databaseURL: 'https://train-together-ec92b.firebaseio.com',
  projectId: 'train-together-ec92b',
  storageBucket: 'gs://train-together-ec92b.appspot.com',
  messagingSenderId: '821921239682',
  appId: '1:821921239682:web:35ef2c869a99fc436a5a9b',
};
firebase.initializeApp(config);
// firebase utils
const db = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase refferences
const databaseRef = db.ref();
const usersRef = db.ref('users');
const categoriesRef = db.ref('categories');

export default {
  db,
  auth,
  currentUser,
  databaseRef,
  usersRef,
  categoriesRef,
  storage,
};
