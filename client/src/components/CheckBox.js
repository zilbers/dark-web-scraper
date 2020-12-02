import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

function CheckBox({ showing, setShowing, options }) {
  return (
    <Container>
      {options.map((item, index) => (
        <span key={item}>
          <input
            type='checkbox'
            id={item}
            name={item}
            value={item}
            onChange={() => {
              setShowing({ ...showing, [item]: !showing[item] });
            }}
            checked={showing[item.name]}
          />
          <label htmlFor={item}>{item}</label>
        </span>
      ))}
    </Container>
  );
}

export default CheckBox;
