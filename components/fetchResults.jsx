import React from 'react';

const ResultTable = ({ results }) => {
  
  return (
    <table>
      <thead>
        <tr>
          <th>Number</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {results.map(result => (
          <tr key={result._id}>
            <td>{result.time}</td>
            <td>{result.number}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultTable;
