import { useState } from "react";
import { Grid, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from './authenticator';

const useStyles = makeStyles({
  containerBox: {
    position: 'absolute', left: '50%', top: '40%',
    transform: 'translate(-50%, -50%)',
  },
  gridItem: {
    minWidth: "300px"
  },
  textFieldBox: {
    width: '100%'
  },
  buttonFormat: {
    textAlign: "center"
  },


});

export default function Login() {
  var style = useStyles()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openInvalidLogin, setOpenInvalidLogin] = useState(false);
  const [openInvalidRegister, setOpenInvalidRegister] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  // Initialize Firebase
  initializeApp(firebaseConfig);
  const auth = getAuth();

  function updateEmail(e) {
    setEmail(e.target.value);
  }

  function updatePassword(e) {
    setPassword(e.target.value);
  }

  function updateInvalidLogin(e) {
    setOpenInvalidLogin(false);
  }

  function updateOpenInvalidRegister(e) {
    setOpenInvalidRegister(false);
  }
  function updateOpenSuccess(e) {
    setOpenSuccess(false);
  }

  function onSubmit(e) {
    if (email === "" || password === "") {
      setOpenInvalidRegister(true);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Logged In");
        console.log(user);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/wrong-password':
            setOpenInvalidLogin(true);
            console.log(`Wrong Password`);
            break;
          case 'auth/user-not-found':
            setOpenInvalidLogin(true);
            console.log(`No user with the Email address ${email} exists.`);
            break;
          case 'auth/invalid-email':
            setOpenInvalidLogin(true);
            console.log(`Email address is not correctly formatted.`);
            break;
          
          default:
            console.log(error.message);
            break;
        }
      });
  }

  function onRegister(e) {
    if (email === "" || password === "") {
      setOpenInvalidRegister(true);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Registered");
        console.log(user);

      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setOpenInvalidRegister(true);
            console.log(`Email address ${email} already in use`);
            break;
          case 'auth/invalid-email':
            setOpenInvalidRegister(true);
            console.log(`Email address ${email} is invalid.`);
            break;
          case 'auth/operation-not-allowed':
            setOpenInvalidRegister(true);
            console.log(`Error during sign up.`);
            break;
          case 'auth/weak-password':
            setOpenInvalidRegister(true);
            console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            break;
          default:
            console.log(error.message);
            break;
        }
      });
  }

  return(
    <div>
      <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal:'center' }}
          open={openInvalidLogin}
          onClose = {updateInvalidLogin}
          autoHideDuration={3000}
        > 
          <Alert onClose={updateInvalidLogin} severity="error" sx={{ width: '100%' }}>
            Invalid Email/ Incorrect Password entered
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal:'center' }}
          open={openInvalidRegister}
          onClose = {updateOpenInvalidRegister}
          autoHideDuration={3000}
        >
          <Alert onClose={updateOpenInvalidRegister} severity="error" sx={{ width: '100%' }}>
            User already exists/ Email or Password field not completed
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal:'center' }}
          open={openSuccess}
          onClose = {updateOpenSuccess}
          autoHideDuration={3000}
        >
          <Alert onClose={updateOpenSuccess} severity="success" sx={{ width: '100%' }}>
            Login Successful!
          </Alert>
        </Snackbar>
      <Grid 
      container 
      rowSpacing = {2} 
      direction="column"
      alignItems = "center"
      justifyContent="center"
      className={style.containerBox}
      >

        <Grid 
        item 
        sm = {12} 
        align="center"
        justify="center">
          <h2>Login</h2>
        </Grid>

        <Grid 
        item 
        sm = {12}
        className={style.gridItem}
        >
          <TextField
            label = "Email"
            required = {true}
            className={style.textFieldBox}
            onChange = {updateEmail}
          />
        </Grid>

        <Grid 
        item 
        sm = {12}
        className={style.gridItem}
        >
          <TextField
            label = "Password"
            type='password'
            required = {true}
            className={style.textFieldBox}
            onChange = {updatePassword}
          />

        </Grid>

        <Grid 
        item 
        sm = {12}
        >
          <Stack spacing={2} direction="row"> 
            <Button variant="contained" onClick={onSubmit}>Submit</Button>
            <Button variant="contained" onClick={onRegister}>Register</Button>
          </Stack>

        </Grid>
      </Grid>
    </div>
  );
}
