import React, { useContext, useEffect, useState } from 'react'
import AdminButton from './HandleResults';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import axios from 'axios';
import Timer from '../components/Timer'
import Link from 'next/link';
import Cookie from 'js-cookie';
import {Howl} from 'howler'

function Header() {

  const buttonClickSound4 = new Howl({
    src: ['/logout.mp3'],
});

const Router = useRouter();

const pageReload = () => {

  Router.reload()


}

  const handleLogoutClick = () => {
    setShowModal(false);
    handleLogout();
  };

  const handleCloseClick = () => {
    setShowModal(true);
  };
  const [showModal, setShowModal] = useState(false);

  const [time, setTime] = useState(new Date());

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
  const nextToDrawtime = nextToDraw.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const { state = {}, dispatch } = useContext(DataContext)
  const { auth = {} } = state
  const [balance, setBalance] = useState(0)
  const router = useRouter()

  const isActive = (r) => {
    if (r === router.pathname) {
      return " active"
    } else {
      return ""
    }
  }



  const handleLogout = () => {
    Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
    localStorage.removeItem('firstLogin')
    dispatch({ type: 'AUTH', payload: {} })
    router.push('/')
  }

  useEffect(() => {
    if (Object.keys(auth).length > 0) {
      axios.get(`/api/user/balance?userName=${auth.user.userName}`)
        .then(response => {
          setBalance(response.data.balance)
        })
        .catch(error => console.error(error))
    }
  }, [auth])

  const [isFullScreen, setIsFullScreen] = useState(false);

  const fullScreenButton = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };


  return (
    <div className='w-full bg-black  border-white border-b-2  '>
      <div className='w-full flex justify-between ' >
        <div className='bg-black  h-[70px] '>
          <h1 className='font-bold mt-4 lg:text-2xl font-mono  text-white' id='balance'>🪙 Balance: {balance}</h1>
        </div>
        <div className='bg-black lg:text-2xl  w-[250px] h-[70px] '>
          <h1 id="currentTime" className='text-white mt-4 font-mono'>⏲️ Draw: {nextToDrawtime}</h1>
        </div>

        <div className='flex bg-black justify-between'>
          <Timer />
        </div>

        <div className='flex mt-[10px]  '>
          <div className='flex space-x-5 '>
          <h1 onClick={fullScreenButton} className='cursor-pointer hidden lg:text-3xl lg:block'>🖥️</h1>
            <Link href='/rules'><img className=' lg:h-[40px] h-[20px]' src='/question.png' /></Link>
            <img  onClick={pageReload} className='cursor-pointer h-[20px] lg:h-[40px]' src='/refresh.png' />
            <img className='cursor-pointer h-[20px] lg:h-[40px]' src='/close.png' onClick={() =>{ buttonClickSound4.play(); handleCloseClick();}} />
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative bg-white w-80 rounded-lg shadow-lg">
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Logout</h2>
                <p className="text-gray-700">
                  Are you sure you want to logout?
                </p>
              </div>
              <div className="p-4 bg-gray-100 rounded-b-lg">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
