import { Card, Tab, Tabs } from '@blueprintjs/core';
import { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from './context/UserContext';
import Home from './components/Home';
import LoginForm from './components/Forms/LoginForm';
import RegisterForm from './components/Forms/RegisterForm';
import Loader from './Loader';
import Axios from 'axios';
import { Switch, Route, Redirect } from 'react-router-dom';
import TicketForm from './components/Forms/TicketForm';
import { Nav } from './components/Nav';

function App() {
  const [currentTab, setCurrentTab] = useState('login');
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    Axios.post('/refreshToken', {
      withCredentials: true,
      // Pass authentication token as bearer token in header
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      console.log('Response: ' + res);
      if (res.status === 200) {
        const data = res.data;
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const syncLogout = useCallback((event) => {
    if (event.key === 'logout') {
      window.location.reload();
    }
  }, []);

  return userContext.token === undefined || userContext.token === null ? (
    <>
      <Switch>
        <Route path='/'>
          <div className='box'></div>
          <Card elevation='1' className='centered'>
            <Tabs id='Tabs' onChange={setCurrentTab} selectedTabId={currentTab}>
              <Tab id='login' title='Login' panel={<LoginForm />} />
              <Tab id='register' title='Register' panel={<RegisterForm />} />
              <Tabs.Expander />
            </Tabs>
          </Card>
        </Route>
      </Switch>
    </>
  ) : userContext.token ? (
    <>
    <Nav/>
      <Switch>
        <Route path='/home'>
          <Home />
        </Route>
      </Switch>
      <Redirect
        to={{
          pathname: '/home',
        }}
      />
    </>
  ) : (
    <Loader />
  );
}

export default App;
