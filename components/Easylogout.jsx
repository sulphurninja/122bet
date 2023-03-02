import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import Cookie from 'js-cookie'
import axios from 'axios'

function Easylogout() {
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
    router.push('/login')
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

  const loggedRouter = () => {
    return (
      <div className='bg-green-200 w-[100px] mt-[100px] ml-[100px] '>
        <p>Balance: ${balance}</p>
        <button className='bg-white cursor-pointer font-[30px]' onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      {
        Object.keys(auth).length === 0
          ? <li className='bg-green-200 mt-[100px] w-[40px]'>
              <a href='/'>Login</a>
            </li>
          : loggedRouter()
      }
    </div>
  )
}


export default Easylogout
