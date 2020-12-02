import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Label,
  Sector,
} from 'recharts';
import styled from 'styled-components';
import CheckBox from './CheckBox';
import Input from './Input';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const OptionsContainer = styled.div`
  align-self: center;
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
    width: 300px;
  }
`;
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AAAAAA',
  '#800080',
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    label,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g key={payload.name}>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={COLORS[value % COLORS.length]}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={COLORS[value % COLORS.length]}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'
      >{`PV ${label}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function Chart({ url }) {
  const [data, setData] = useState([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState('');
  const [wordList, setWordList] = useState([]);
  const [showing, setShowing] = useState(() => {
    const newShowing = {};
    for (const key of wordList) {
      newShowing[key] = true;
    }
    return newShowing;
  });
  const [activeIndex, setActiveIndex] = useState();

  async function getAndSet(url, wordList, setter) {
    const newData = [];
    for (const word of wordList) {
      if (showing[word]) {
        const { data: result } = await axios.get(`${url}?q=${word}`);
        newData.push(result);
      }
    }
    setter(newData);
  }

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  const handleClick = () => {
    setWordList((oldList) => [...oldList, input]);
    setInput('');
  };

  useEffect(() => {
    getAndSet(url, wordList, setData);
    setReady(true);
  }, [wordList, showing]);

  return (
    <>
      <Container>
        <h3>Keywords Appearance</h3>
        <OptionsContainer>
          <Input value={input} setValue={setInput} label='Search' />
          <button onClick={handleClick}>Add</button>

          <CheckBox
            showing={showing}
            setShowing={setShowing}
            options={wordList}
          />
        </OptionsContainer>
        {ready && (
          <ResponsiveContainer width='100%' aspect={4.0 / 3.0} maxHeight={300}>
            <PieChart width={730} height={250}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                dataKey='value'
                nameKey='word'
                outerRadius={50}
                fill='#8884d8'
                onMouseEnter={onPieEnter}
              ></Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
}

export default Chart;
