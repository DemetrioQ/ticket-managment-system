import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useContext } from 'react';
import Axios from 'axios';
import { UserContext } from '../../context/UserContext';

const theme = createTheme();

function RegisterForm() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  const Register = () => {
    Axios.post(
      '/register',
      { username: userName, email: userEmail, password: userPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
      // , {withCredentials: true, credentials: 'include'})
      .then(async (res) => {
        setUserContext((oldValues) => {
          return { ...oldValues, token: res.data.token };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // <>
    //   <form className='auth-form'>
    //     <FormGroup label='Username' labelFor='username'>
    //       <InputGroup id='username' placeholder='Username' onChange={(e) => setUserName(e.target.value)} value={userName} />
    //     </FormGroup>
    //     <FormGroup label='Email' labelFor='email'>
    //       <InputGroup id='email' type='email' placeholder='Email' onChange={(e) => setUserEmail(e.target.value)} value={userEmail} />
    //     </FormGroup>
    //     <FormGroup label='Password' labelFor='password'>
    //       <InputGroup id='password' placeholder='Password' type='password' onChange={(e) => setUserPassword(e.target.value)} value={userPassword} />
    //     </FormGroup>
    //     <Button intent='primary' text='Register' fill type='submit' onClcik={Register} />
    //   </form>
    // </>
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box component='form' noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserName(event.target.value)} required fullWidth id='username' label='Username' name='username' autoComplete='username' />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserEmail(event.target.value)} required fullWidth id='email' label='Email Address' name='email' autoComplete='email' />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserPassword(event.target.value)} required fullWidth name='password' label='Password' type='password' id='password' autoComplete='new-password' />
              </Grid>
            </Grid>
            <Button type='submit' onClick={Register} fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RegisterForm;
