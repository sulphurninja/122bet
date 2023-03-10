import { useState, useEffect } from 'react';

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [drawTimes, setDrawTimes] = useState([]);
  const [nextToDrawtime, setNextToDrawtime] = useState('');
  const [timeToDraw, setTimeToDraw] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextToDraw = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes() + 1,
        0,
        0
      );
      const timeDiff = Math.floor((nextToDraw - now) / 1000);
      const seconds = timeDiff % 60;
      const newTimeToDraw = `${seconds.toString().padStart(2, "0")}`;
      const newNextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setNextToDrawtime(newNextToDrawtime);
      setTimeToDraw(newTimeToDraw);
    }, 1000);

    const startDrawTime = new Date();
    startDrawTime.setMinutes(Math.floor(startDrawTime.getMinutes() / 5) * 5);
    startDrawTime.setSeconds(0);
    const drawTimes = Array(10).fill().map((_, index) => {
      const drawTime = new Date(startDrawTime.getTime() - index * 5 * 60 * 1000);
      return drawTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    });

    setDrawTimes(drawTimes);

    const intervalId = setInterval(() => {
      Promise.all(drawTimes.map(drawTime => (
        fetch(`/api/getPrior?drawTime=${drawTime}`).then(res => res.json())
      ))).then(results => {
        setResults(results.map(result => (result.winningNumber)));
      });
    }, 20000);
    return () => {
      clearInterval(timer);
      clearInterval(intervalId);
    }
  }, [nextToDrawtime, timeToDraw, results]);

  const getRowClassName = (winningNumber) => {
    if (winningNumber === 1 || winningNumber === 5 || winningNumber === 9) {
      return 'bg-red-500';
    }
    if (winningNumber === 2 || winningNumber === 6 || winningNumber === 10) {
      return 'bg-yellow-500';
          
    }
    if (winningNumber === 3 || winningNumber === 7 || winningNumber === 11) {
      return 'bg-green-500';
    }
    if (winningNumber === 4  || winningNumber === 8 || winningNumber === 12) {
      return 'bg-blue-500';
    }
    return '';
  };

  return (
    <div className=' '>
    <table className='text-white w-[300px] font-bold  text-center '>
      <thead>
        <tr className=''>
          <th>Time</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody className='text-center'>
        {drawTimes.map((drawTime, index) => (
          <tr key={drawTime} className={getRowClassName(results[index])}>
            <td className='border-2'>{drawTime}</td>
            <td className='border-2'>{results[index] || '-' }</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default ResultsTable;
