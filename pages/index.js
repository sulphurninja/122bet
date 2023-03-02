import React, { useContext, useState, useEffect } from 'react'
import { DataContext }  from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'


function login() {
    const initialState = { userName: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { userName, password } = userData
    const {state = {}, dispatch} = useContext(DataContext)
    const { auth = {} } = state
    const router = useRouter()

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()

        const res = await postData('auth/login', userData)

        dispatch({type: 'AUTH', payload:{
            token: res.access_token,
            user: res.user
        }})

        Cookie.set('refreshtoken', res.refresh_token,{
            path:'/api/auth/accessToken',
            expires: 7
        })

        localStorage.setItem('firstLogin', true)
    }

    useEffect(() => {
        if (Object.keys(auth).length !== 0) {
          if (auth.user.role === 'admin') {
            router.push("/admin");
          } else {
            router.push("/bet");
          }
        }
      }, [auth]);

  return (
    <div className='bg-black'>
    <div className="w-full max-w-xs ml-auto mr-auto items-center mt-[100px]">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                    Username
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name='userName' value={userName} onChange={handleChangeInput} type="text" placeholder="Username" />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password"  name='password' value={password} onChange={handleChangeInput} placeholder="******************" />
               
            </div>
            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Login
                </button>
            </div>
        </form>
        <p className="text-center text-white  text-xs">
            &copy;Dus Ka Dum - A3M.io
        </p>
        <p className='text-center text-white text-xs'>
         Inquiries: aditya@a3m.io
        </p>
    </div>
</div>
  )
}

export default login