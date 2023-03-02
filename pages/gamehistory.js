import Link from 'next/link'
import React from 'react'

function gamehistory() {
    return (
        <div className='ml-auto mt-[50px]  bg-cyan-300 mr-auto text-center h-[500px] w-[1000px]'>
            <div className='absolute  mt-[10px] ml-[430px] w-[150px] h-[30px]  bg-green-800 rounded-lg items-center]'>
               <Link href='/rules'>
                <h1 className='text-white font-bold'>Rules</h1>
                </Link>
            </div>
            <div className='absolute   mt-[10px] ml-[200px] w-[150px] h-[30px]  bg-green-800 rounded-lg items-center]'>
                <Link href='/gamehistory'>
                    <h1 className='text-gray-300 hover:text-white font-bold'>Game History</h1>
                </Link>
            </div>
            <Link href='/bet'>
            <div className='absolute rounded-full text-white font-bold pt-[5px] bg-green-800 w-[40px] ml-[950px]  h-[40px] items-center]'>
                X
            </div>
            </Link>
           
        </div>
    )
}

export default gamehistory