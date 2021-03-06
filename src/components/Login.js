import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import './Login.css';
import gmailLogoImg from '../img/gmail-logo.jpg';
import { login } from '../features/userSlice';
import { auth, provider } from '../firebase';
import isUserInDB from '../isUserInDB';

function Login() {
  const dispatch = useDispatch();

  const signIn = () => {
    // authentication
    auth
      .signInWithPopup(provider)
      .then(({ user }) => {
        dispatch(
          login({
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
          })
        );
        console.log(`${user.displayName} logged in`);
        // eslint-disable-next-line no-unused-vars
        const t = isUserInDB(user);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={gmailLogoImg} alt="gmail logo" />

        <Button variant="contained" color="primary" onClick={signIn}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;
