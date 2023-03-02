import Link from 'next/link';
import React, { useContext } from 'react'
import AdminPanel from '../components/AdminPanel';
import Header from '../components/Header';
import { DataContext } from '../store/GlobalState';

const AdminDashBoard = () => {
  const { state } = useContext(DataContext);
  const { auth } = state;

  if (auth.user && auth.user.role === 'admin') {
    return <AdminPanel />;
  } else {
    return <main className='bg-black '>
    <Header/>
    <div className=' w-full absolute bg-black '>
    <Link href='/bet'>
    <h1 className='text-black cursor-pointer absolute font-bold text-5xl'> 🔙 <span className='hover:underline '>Bet Page</span></h1>
    </Link>
    <h1 className='text-black text-5xl  ml-auto flex  absolute mt-[20%] pl-28 font-bold'>You are not authorized to view this page bitch!</h1>
    </div>
    </main>;
  }
  };

export default AdminDashBoard
