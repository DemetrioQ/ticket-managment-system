import Axios from 'axios';
import { useState, useContext, useCallback, useEffect } from 'react';
import Popup from './Popup';
import TicketForm from './Forms/TicketForm';
import { UserContext } from '../context/UserContext';
import Loader from '../Loader';
import { Button, Card } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

function Home(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [tickets, setTickets] = useState(null);
  const state = {
    items: [],
  };

  const fetchUserDetails = useCallback(() => {
    Axios.get('/me', {
      withCredentials: true,
      // Pass authentication token as bearer token in header
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        const data = response.data;
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);

  const fetchTickets = useCallback(() => {
    Axios.get('/user/tickets', {
      withCredentials: true,
      // Pass authentication token as bearer token in header
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.status === 200) {
        const data = response.data;
        setTickets(data);
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setTickets, tickets]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  useEffect(() => {
    if (userContext.details && !tickets) {
      fetchTickets();
    }
  });

  const refetchHandler = () => {
    // set details to undefined so that spinner will be displayed and
    //  fetchUserDetails will be invoked from useEffect
    setUserContext((oldValues) => {
      return { ...oldValues, details: undefined };
    });
  };

  //Finish add, remove, update tickets
  const deleteTicket = (ticket_id) => {};

  const addOrEdit = (ticket, resetForm) => {
    if (ticket.id == 0) {
      console.log('creating ticket');
    } else console.log('uptading ticket');
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };
  return userContext.details === null ? (
    'Error Loading User details'
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <>
      <div className='centered-form'>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ 'font-size': '40px' }}>Tickets</h1>
        </div>
        <Button
          intent='success'
          className='btn btn-sm btn-success mb-2'
          style={{ float: 'right' }}
          onClick={() => {
            setOpenPopup(true);
            setRecordForEdit(null);
          }}>
          Add Ticket
        </Button>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Id</th>
              <th style={{ width: '30%' }}>Title</th>
              <th style={{ width: '30%' }}>Description</th>
              <th style={{ width: '30%' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets &&
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.Priority.priority}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link to={`/edit/${ticket.id}`} className='btn btn-sm btn-primary mr-1'>
                      Edit
                    </Link>
                    <button onClick={() => deleteTicket(ticket.id)} className='btn btn-sm btn-danger btn-delete-user' disabled={tickets.isDeleting}>
                      {ticket.isDeleting ? <span className='spinner-border spinner-border-sm'></span> : <span>Delete</span>}
                    </button>
                  </td>
                </tr>
              ))}
            {!tickets && (
              <tr>
                <td colSpan='4' className='text-center'>
                  <div className='spinner-border spinner-border-lg align-center'></div>
                </td>
              </tr>
            )}
            {tickets && !tickets.length && (
              <tr>
                <td colSpan='4' className='text-center'>
                  <div className='p-2'>No Tickets to display </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Popup title='Ticket Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <TicketForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
    </>
  );
}

export default Home;
