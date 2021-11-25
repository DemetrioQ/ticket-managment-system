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
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Fade from '@material-ui/core/Fade';

const theme = createTheme();

function RegisterForm() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);
  const [open, setOpen] = React.useState(false);

  const register = (event) => {
    event.preventDefault();
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
      .then(async (res) => {
        setOpen(true);
        setUserName('');
        setUserEmail('');
        setUserPassword('');
        setUserContext((oldValues) => {
          return { ...oldValues, token: res.data.token };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <Fade in={open} timeout={1000}>
          <Alert
            severity='success'
            variant='outlined'
            onClose={() => {
              setOpen(false);
            }}
            sx={{ margin: 0 }}>
            User registered
          </Alert>
        </Fade>
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
          <Box component='form' onSubmit={register} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserName(event.target.value)} value={userName} required fullWidth id='username' label='Username' name='username' autoComplete='username' />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserEmail(event.target.value)} value={userEmail} required fullWidth id='email' label='Email Address' type='email' name='email' autoComplete='email' />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={(event) => setUserPassword(event.target.value)} value={userPassword} required fullWidth name='password' label='Password' type='password' id='password' autoComplete='new-password' />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RegisterForm;
