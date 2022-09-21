import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { BrowserRouter } from 'react-router-dom';
const firebaseConfig = {
  apiKey: "AIzaSyCVKTmB_S8v1n1EBII5rTHTjVmpLwAZLtw",
  authDomain: "clean-hangar-357611.firebaseapp.com",
  databaseURL: "https://clean-hangar-357611-default-rtdb.firebaseio.com",
  projectId: "clean-hangar-357611",
  storageBucket: "clean-hangar-357611.appspot.com",
  messagingSenderId: "750330015223",
  appId: "1:750330015223:web:a9e94335aa7d993c4c12f2"
};

 const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app)
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
export default app