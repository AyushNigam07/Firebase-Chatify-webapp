import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React from 'react'
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import GoogleIcon from '@mui/icons-material/Google';
import app from '../main'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useState } from "react";
import { auth } from "../main";
import { createUserWithEmailAndPassword , updateProfile , signOut , sendPasswordResetEmail  } from "firebase/auth";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { LoadingButton } from '@mui/lab';
const HomePage = () => {
  const navigate = useNavigate()
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      }); 
      const [email , setEmail] = useState();
      const [password , setPassword] = useState();
      const [loading , setLoading] = useState(false);
      const [isSiqnin , setSiqnIn] = useState(false)
      const [user , setUser] = useState();
      const [name , setName] = useState();

// const forgotPassword = () => {
// sendPasswordResetEmail(auth , email)
// console.log("Working")
// }
const signIn = () => {
  setLoading(true)
  signInWithEmailAndPassword(auth , email , password ).then((e) => {
    toast.success("Login successfull");
    navigate('./MainContent')
  }).catch((error) => {
    console.log(error)
    toast.error("Something went wrong")
    }
    );
    setLoading(false)
}

      const signUp = () => {
setLoading(true);
console.log(auth , email , password)
console.log('working')
createUserWithEmailAndPassword(auth , email , password).then((userCredential) => {
  const user = userCredential.user;
  console.log(user)
  toast.success("Account created successfully")
  updateProfile(auth.currentUser , {
displayName : name ,
  })
  setLoading(false);
})
.catch((error) => {
console.log(error)
toast.error("Something went wrong")
setLoading(false)
});
      }
const authPopup = () => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth(app);
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user)
      console.log(user.displayName)
      console.log(user.photoURL)
      // Cookies.set('name', user.displayName )
      // Cookies.set('photourl', user.photoURL )
      navigate(`/MainContent`)
    })
}
    return (
        <ThemeProvider theme={darkTheme}>
        <Box component='div' sx={{ height: '100vh' , width:"100vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box component='div' display='flex' sx={{ height: '100%' , width:'100%' , flexDirection:'column' ,justifyContent:'center' , alignItems:'center' , background: 'linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)' }}>
      <Stack spacing={3} p={6}>
                <Typography variant="h4" gutterBottom component="div" sx={{ color:'white' , fontWeight:700 , fontFamily: 'Raleway, sans-serif'}}>
        Chatify
      </Typography>

      {
        isSiqnin ? 
      <Typography variant="h5" gutterBottom component="div" sx={{ color:'white' , fontWeight:'600' , fontFamily: 'Raleway, sans-serif'}}>
        Sign in
      </Typography> :
       <Typography variant="h5" gutterBottom component="div" sx={{ color:'white' , fontWeight:'600' , fontFamily: 'Raleway, sans-serif'}}>
      Sign up
     </Typography>
      }
      {
        isSiqnin &&  <TextField id="filled-basic" label="Name" variant="filled"  onChange={(e) => setName(e.target.value)} /> 
      }
      <TextField id="filled-basic" label="Email" variant="filled"  onChange={(e) => setEmail(e.target.value)} />
      <TextField id="filled-basic" label="Paasword" variant="filled"  onChange={(e) => setPassword(e.target.value)} />
{
  isSiqnin ? 
  <Button variant="outlined" onClick={() => signUp()} >Sign up</Button> : <Button variant="outlined" onClick={() => signIn()}> Sign in  </Button> 
}
<ToastContainer />
    <Button variant="contained" onClick={()=>authPopup()} sx={{color:"whitesmoke" , backgroundColor:"#4c577a"}}>
    <GoogleIcon sx={{marginRight:"4px"}}/> 
    Login with google
    </Button>
    {
      isSiqnin ?  <Button onClick={() => setSiqnIn(false)} > Back to login page </Button> : <Button onClick={() => setSiqnIn(true)} > Create New Account </Button>   
    }
    {/* <Button variant="outlined" onClick={() => forgotPassword()} > forgot password ? </Button> */}
      </Stack> 
            </Box>
        </Box> 
        </ThemeProvider>
    )
}

export default HomePage