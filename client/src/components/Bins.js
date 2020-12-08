import React, { useState, useRef, useCallback, useContext } from 'react';
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
import { UserContext } from '../context/UserContext';
import './Bins.css';

const useStyles = makeStyles({
  container: {
    height: '30vh',
    width: '100%',
  },
  root: {
    flexGgrow: 2,
    height: '30vh',
    width: '100%',
  },
});

const columns = [
  { id: 'header', label: 'Header', minWidth: 100 },
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

export default function Bins({ hiding, setHiding, data }) {
  const context = useContext(UserContext);
  const [pageNumber, setPageNumber] = useState(0);
  const [search, setSearch] = useState(() => '');
  const [sort, setSort] = useState(() => '');
  const [showAll, setShowAll] = useState(false);

  const { logs, hasMore, loading, error } = useLogsSearch(
    pageNumber,
    search,
    sort,
    context.userId
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

  const handleHide = async (id) => {
    setHiding((old) => [...old, id]);
    console.log([...hiding, id]);
    axios.put(`/api/user/_alerts?id=${context.userId}`, [...hiding, id]);
  };

  return (
    <>
      <OptionsContainer>
        <Input
          value={search}
          setValue={setSearch}
          label='Search'
          setPage={setPageNumber}
        />
        <h5>
          Show All:
          <input
            type='checkbox'
            name='showAll'
            value={showAll}
            onChange={() => setShowAll(!showAll)}
          />
        </h5>
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
                !showAll &&
                logs
                  .filter(({ id }) => !hiding.includes(id))
                  .map((bin, index) =>
                    logs.filter(({ id }) => !hiding.includes(id)).length ===
                    index + 1 ? (
                      <TableRow
                        ref={lastLogElementRef}
                        onClick={() => handleHide(bin.id)}
                        key={bin.header + index}
                        className='tr'
                      >
                        <TableCell>{bin.header}</TableCell>
                        <TableCell>{bin.content}</TableCell>
                        <TableCell>{bin.author}</TableCell>
                        <TableCell>{bin.date}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        key={bin.header + index}
                        onClick={() => handleHide(bin.id)}
                        className='tr'
                      >
                        <TableCell>{bin.header}</TableCell>
                        <TableCell>{bin.content}</TableCell>
                        <TableCell>{bin.author}</TableCell>
                        <TableCell>{bin.date}</TableCell>
                      </TableRow>
                    )
                  )}
              {logs &&
                showAll &&
                logs.map((bin, index) =>
                  logs.length === index + 1 ? (
                    <TableRow
                      ref={lastLogElementRef}
                      key={bin.header + index}
                      className='tr'
                    >
                      <TableCell>{bin.header}</TableCell>
                      <TableCell>{bin.content}</TableCell>
                      <TableCell>{bin.author}</TableCell>
                      <TableCell>{bin.date}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={bin.header + index} className='tr'>
                      <TableCell>{bin.header}</TableCell>
                      <TableCell>{bin.content}</TableCell>
                      <TableCell>{bin.author}</TableCell>
                      <TableCell>{bin.date}</TableCell>
                    </TableRow>
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
