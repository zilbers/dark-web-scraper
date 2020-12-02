import React, { useState, useRef, useCallback, useEffect } from 'react';
import useLogsSearch from '../hooks/useLogsSearch';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import styled, { css } from 'styled-components';
import Input from './Input';
import axios from 'axios';
import './Bins.css';

const useStyles = makeStyles({
  container: {
    maxHeight: 250,
  },
  root: {
    flexGgrow: 2,
  },
});

const columns = [
  { id: 'header', label: 'Header', minWidth: 170 },
  { id: 'content', label: 'Content', minWidth: 100 },
  {
    id: 'author',
    label: 'Author',
    minWidth: 90,
  },
  {
    id: 'date',
    label: 'Date',
    minWidth: 100,
  },
];

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
`;

export default function Bins({ hiding, setHiding }) {
  // const [showing, setShowing] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState(() => '');
  const [sort, setSort] = useState(() => '');

  const { logs, hasMore, loading, error } = useLogsSearch(
    pageNumber,
    search,
    sort
  );

  const classes = useStyles();
  const observer = useRef();

  const lastLogElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleClose = async (index) => {
    setHiding((old) => [...old, index]);
    axios.post('/api/user/_alerts', [...hiding, index]);
  };

  return (
    <>
      <OptionsContainer>
        {/* <Select
          options={sortingOptions}
          currentChosenOpttion={sort}
          setOption={setSort}
          select='Sort'
        /> */}
        <Input
          value={search}
          setValue={setSearch}
          label='Search'
          setPage={setPageNumber}
        />
      </OptionsContainer>

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {logs &&
                logs
                  .sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                  })
                  .map((bin, index) =>
                    !hiding.includes(index) ? (
                      logs.length === index + 1 ? (
                        <TableRow
                          ref={lastLogElementRef}
                          onClick={() => handleClose(index)}
                          key={bin.header}
                          className='tr'
                        >
                          <TableCell>{bin.header}</TableCell>
                          <TableCell>{bin.content}</TableCell>
                          <TableCell>{bin.author}</TableCell>
                          <TableCell>{bin.date}</TableCell>
                        </TableRow>
                      ) : (
                        <TableRow
                          key={bin.header}
                          onClick={() => handleClose(index)}
                          className='tr'
                        >
                          <TableCell>{bin.header}</TableCell>
                          <TableCell>{bin.content}</TableCell>
                          <TableCell>{bin.author}</TableCell>
                          <TableCell>{bin.date}</TableCell>
                        </TableRow>
                      )
                    ) : (
                      ''
                    )
                  )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  );
}
