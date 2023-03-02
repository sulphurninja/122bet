import React, { useContext } from 'react'
import Game from '../components/game';
import Header from '../components/Header';
import { DataContext } from '../store/GlobalState';

const AdminDashBoard = () => {
  const { state } = useContext(DataContext);
  const { auth } = state;

  if (auth.user && auth.user.role === 'user' || 'admin') {
    return <Game />;
  } else {
    return <main className='bg-black '>
    <Header/>
    <div className=' w-full absolute bg-black '>
    <h1 className='text-black text-5xl  ml-auto flex  absolute mt-[20%] pl-28 font-bold'>You are not authorized to view this page.</h1>
    </div>
    </main>;
  }
  };

export default AdminDashBoard
