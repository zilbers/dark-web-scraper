import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState();

  const getData = async () => {
    const { data: results } = await axios.get('/api/data');
    setData(results);
  };

  const checkForNewData = async () => {
    await axios.get('/api/data/check');
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className='App'>
      {/* <button onClick={checkForNewData}>Check For New Data</button> */}
      {data &&
        data.map((item) => (
          <div>
            <h4>{item.headers}</h4>
            <div>{item.content}</div>
            <span>{item.author}</span>
            <span>{item.date}</span>
          </div>
        ))}
    </div>
  );
}

export default App;
