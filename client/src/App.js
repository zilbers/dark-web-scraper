import { useEffect, useState } from 'react';
import axios from 'axios';
import AppBar from './components/AppBar';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import Bins from './components/Bins';
import useDebouncedSearch from './hooks/useDebouncedSearch';
import styled from 'styled-components';
import './App.css';

async function searchInDb(query) {
  const { data: results } = await axios.get(`/api/data/_search?q=${query}`);
  return results;
}

const useSearchInDb = () => useDebouncedSearch((text) => searchInDb(text));

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* justify-content: space-evenly; */
  align-items: flex-start;
  flex-direction: row;
`;

function App() {
  const [data, setData] = useState();
  const [hiding, setHiding] = useState([]);
  const { inputText, setInputText, searchResults } = useSearchInDb();

  const getData = async () => {
    const { data: results } = await axios.get('/api/data');
    setData(results);
  };

  const getHiding = async () => {
    const { data: results } = await axios.get('/api/user/_alerts');
    setHiding(results.hiding);
  };

  useEffect(() => {
    getData();
    getHiding();
  }, []);

  return (
    <div className='App'>
      {data && (
        <>
          <AppBar
            length={data.length - hiding.length}
            deleted={hiding.length}
            inputText={inputText}
            setInputText={setInputText}
            setHiding={setHiding}
          />
          <Container>
            <Bins hiding={hiding} setHiding={setHiding} />
            <LineChart
              url='api/data/_sentiment'
              data={data}
              type='comparative'
            />
            <LineChart url='api/data/_sentiment' data={data} type='score' />
            <PieChart
              url='api/data/_label'
              wordList={['bitcoin', 'weapons', 'stolen', 'credit']}
            />
          </Container>
          {Array.isArray(searchResults.result) &&
            searchResults.result.map((item, index) => (
              <div key={index}>
                <h4>{item.header}</h4>
                <div>{item.content}</div>
                <span>{item.author}</span>
                <span>{item.date}</span>
              </div>
            ))}
        </>
      )}
    </div>
  );
}

export default App;
