import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import HandleResults from '../components/HandleResults';
import Header from "../components/Header";
import Modal from '../components/ModalResult'
import { DataContext } from '../store/GlobalState';

const AdminPanel = () => {

    const [time, setTime] = useState(new Date());
    const [showModalResult, setShowModalResult] = useState(false);
    const [winningNumbers, setWinningNumbers] = useState(Array(12).fill(null));
    const { state = {}, dispatch } = useContext(DataContext)
    const { auth = {} } = state
    const [balance, setBalance] = useState()
    const [userName, setUserName] = useState()
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
    }

    const handleBalanceChange = (event) => {
        setBalance(Number(event.target.value));
    };
    const handleUserNameChange = (event) => {
        setUserName((event.target.value));
    };

    // Update the users balance

    const handleBalanceSubmit = async () => {
        try {
            await axios.get(`/api/updateBalance?userName=${userName}&balance=${balance}`);
        } catch (error) {
            console.error(error);
        }
    };
    console.log(balance)

    return (

        <main className='h-screen bg-black w-screen relative overflow-hidden'>
            <Header />
            <div className='flex absolute w-full'></div>
            <h1 className='text-white font-bold  ml-auto text-2xl font-mono mt-[5%]'>Choose the Next Result:</h1>
            {winningNumbers.map((number, index) => (
                <button className='text-white border-4 border-green-200  mx-4  lg:ml-[5%] text-xs lg:text-2xl pr-3 rounded-full lg:w-[100px] w-[30px] h-[30px] lg:mt-[5%]  my-4 pl-2 font-bold bg-red-700 text-center lg:h-[50px]   ' key={index} onClick={() => handleButtonClick(index)}>
                    {number || index + 1}
                </button>
            ))}
            <div className='mt-4 ml-10 '>
                <Link href='/adminaccessonlyregister'>
                    <div className='bg-orange-600 cursor-pointer absolute mt-[-10%] lg:mt-10 ml-[50%] h-10 rounded-lg w-60'>
                        <h1 className='text-white font-bold text-xl absolute mt-1 ml-4 '>👤 Create an User</h1>
                    </div>
                </Link>
                <h1 className='font-bold text-2xl text-white'>Update User Balance:</h1>
                <div className='mt-4'>
                    <label className='text-white pt-10 font-bold pr-4 text-2xl' htmlFor="balance">UserName:</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        className='h-10 border-4 text-white font-bold  text-xl rounded-lg bg-red-400 text-center w-50'
                        value={userName}
                        onChange={handleUserNameChange}
                    />
                </div>
                <div className='mt-4'>
                    <label className='text-white pt-10 font-bold pr-4 text-2xl' htmlFor="balance">Balance:</label>
                    <input
                        type="number"
                        id="balance"
                        name="balance"
                        className='h-10 border-4 text-white font-bold  text-xl rounded-lg bg-red-400 text-center w-28'
                        value={balance}
                        onChange={handleBalanceChange}
                    />
                </div>
                <div className='flex '>
                    <button className='text-xl font-bold  bg-green-600 hover:bg-green-800 text-white rounded-lg w-60 absolute mt-4  ' onClick={handleBalanceSubmit}>Update Balance</button>
                </div>

            </div>
            <Modal isOpen={showModalResult} onClose={() => setShowModalResult(false)} />

        </main>

    );
};

export default AdminPanel;




