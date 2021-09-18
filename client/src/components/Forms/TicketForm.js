import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import NativeSelect from '@mui/material/NativeSelect';

const theme = createTheme();

function TicketForm(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState();
  const handleSubmit = (e) => {
    console.log('hi');
  };
  const addTicket = (e) => {};

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <TextField
              margin='normal'
              required
              fullWidth
              id='title'
              label='Title'
              name='tile'
              autoFocus
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='description'
              label='Description'
              id='description'
              multiline
              rows={4}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <InputLabel id='priority-label'>Priority</InputLabel>
            <NativeSelect
              required
              labelId='priority-label'
              id='priority'
              value={priority}
              label='Priority'
              autoWidth
              onChange={(e) => {
                setPriority(e.target.value);
              }}>
              <option value={1}>Low</option>
              <option value={2}>Normal</option>
              <option value={3}>Medium</option>
              <option value={4}>High</option>
            </NativeSelect>
            <Button type='submit' fullWidth variant='contained' style={{ 'margin-top': '10%' }}>
              Add
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default TicketForm;
