import React from 'react';

function BetList({ numberBets }) {
  return (
    <div>
      <ul>
        {numberBets.map((numberBet, index) => (
          <li key={index}>{numberBet}</li>
        ))}
      </ul>
    </div>
  );
}

export default BetList;
