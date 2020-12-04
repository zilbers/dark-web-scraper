import React from 'react';
import { InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { useForm } from 'react-hook-form';
import SettingsIcon from '@material-ui/icons/Settings';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: space-around;
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal() {
  const context = React.useContext(UserContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [keywords, setKeywords] = React.useState([]);
  const [input, setInput] = React.useState('');
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log({ ...data, keywords });
    axios.put(`http://localhost:8080/api/user/_config?id=${context.userId}`, {
      ...data,
      keywords,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setKeywords((currentKeywords) => [...currentKeywords, input]);
    setInput('');
  };

  return (
    <>
      {/* <button type='button' onClick={handleOpen}>
        react-transition-group
      </button> */}

      <IconButton aria-label='settings' color='inherit' onClick={handleOpen}>
        <SettingsIcon />
      </IconButton>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputLabel id='url'>URL:</InputLabel>
              <input name='url' ref={register({ required: true })} />
              {errors.url && <span>This field is required</span>}

              <InputLabel id='url'>Cooldown:</InputLabel>
              <input
                type='number'
                id='cooldown'
                name='cooldown'
                min='1'
                max='20'
                ref={register({ required: true })}
              ></input>
              {errors.cooldown && <span>This field is required</span>}

              <InputLabel id='url'>
                Keywords:{' '}
                {keywords.map((word, index) => (
                  <span key={index}>
                    {word}
                    {index === keywords.length - 1 ? '' : ', '}
                  </span>
                ))}
              </InputLabel>
              <div>
                <input
                  name='keywords'
                  value={input}
                  onChange={({ target }) => setInput(target.value)}
                />
                <button onClick={handleAdd}>Add</button>
              </div>
              {errors.keywords && <span>This field is required</span>}
              <input type='submit' />
            </Form>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
