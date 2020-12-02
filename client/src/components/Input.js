import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styled, { css } from 'styled-components';

const Container = styled.div`
  flex-grow: 1;
`;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  })
);

export default function BasicTextFields({ value, setValue, label, setPage }) {
  const classes = useStyles();

  return (
    <Container>
      <form className={classes.root} noValidate autoComplete='off'>
        <TextField
          id='standard-basic'
          label={label}
          onChange={({ target }) => {
            if (setPage) {
              setPage(0);
            }
            setValue(target.value);
          }}
          value={value}
          // fullWidth={true}
        />
      </form>
    </Container>
  );
}
