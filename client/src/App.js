import { useEffect, useState } from 'react';
import axios from 'axios';
import AppBar from './components/AppBar';
import './App.css';
import useDebouncedSearch from './hooks/useDebouncedSearch';

async function searchInDb(query) {
  const { data: results } = await axios.get(`/api/data/_search?q=${query}`);
  console.log(results);
}

const useSearchInDb = () => useDebouncedSearch((text) => searchInDb(text));

function App() {
  const [data, setData] = useState();
  const [viewed, setViewed] = useState([]);
  const { inputText, setInputText, searchResults } = useSearchInDb();

  const getData = async () => {
    const { data: results } = await axios.get('/api/data');
    setData(results);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='App'>
      {data && (
        <>
          <AppBar
            length={viewed.length}
            deleted={data.length - viewed.length}
            inputText={inputText}
            setInputText={setInputText}
          />
          {data.map((item, index) => (
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
