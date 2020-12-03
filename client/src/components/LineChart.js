import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  ResponsiveContainer,
} from 'recharts';
import styled, { css } from 'styled-components';

const Container = styled.div`
  flex-grow: 1;
  @media (max-width: 750px) {
    width: 100%;
  }

  @media (min-width: 750px) {
    width: 70%;
  }

  @media (min-width: 900px) {
    width: 40%;
  }

  @media (min-width: 1600px) {
    width: 600px;
  }
`;

function Chart({ url, type, data }) {
  const [binsData, setBinsData] = useState(undefined);

  async function getAndSet(url, dataToAnalyze, setter) {
    const { data } = await axios.post(url, dataToAnalyze);
    data.sort((item) => -item[type]);
    setter(data);
  }

  useEffect(() => {
    getAndSet(url, data, setBinsData);
  }, []);

  return (
    <>
      <Container>
        <h3>By-{type}</h3>

        <ResponsiveContainer width='100%' aspect={4.0 / 3.0} maxHeight={300}>
          <LineChart
            data={binsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <Line type='monotone' dataKey={type} stroke='black' />
            <CartesianGrid stroke='#ccc' />
            <XAxis />
            <YAxis dataKey={type} />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    </>
  );
}

export default Chart;
