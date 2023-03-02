import React, { useEffect, useState } from 'react';
import HandleResults from '../components/HandleResults';
import Header from "../components/Header";
import Modal from '../components/ModalResult'

const AdminPanel = () => {

  const [time, setTime] = useState(new Date());
  const [showModalResult, setShowModalResult] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState(Array(12).fill(null));


useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
}, []);

const nextToDraw = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    time.getHours(),
    Math.floor((time.getMinutes() + 5) / 5) * 5,
    0,
    0
);

const timeDiff = Math.floor((nextToDraw - time) / 1000);
const minutes = Math.floor(timeDiff / 60);
const seconds = timeDiff % 60;
const timeToDraw = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
    const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12' }).toUpperCase();

console.log(nextToDrawtime)
  const handleButtonClick = async (index) => {
  try {
    const response = await fetch('/api/updateWinningNumber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winningNumber: index + 1,
        nextToDrawtime: nextToDrawtime,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      const newWinningNumbers = [...winningNumbers];
      newWinningNumbers[index] = index + 1;
      setWinningNumbers(newWinningNumbers);
      setShowModalResult(true)
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <main className='h-screen bg-black w-screen relative overflow-hidden'>
    <Header/>
      <div className='flex w-full'></div>
      {winningNumbers.map((number, index) => (
        <button className='text-black mx-4 text-sm pr-3 ml-auto rounded-full lg:w-[50px] w-[30px] h-[20px]  my-4 pl-4 font-bold bg-white text-center lg:h-[50px]   ' key={index} onClick={() => handleButtonClick(index)}>
          {number || index + 1}
        </button>
      ))}
      <HandleResults />
      <Modal isOpen={showModalResult} onClose={() => setShowModalResult(false)} />
    </main>
  );
};

export default AdminPanel;





