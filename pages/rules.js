import Link from 'next/link'
import React from 'react'

function rules() {
  return (
    <div className='ml-auto mt-[50px]  bg-cyan-300 mr-auto text-center h-[500px] w-[1000px]'>
      <div className='absolute  mt-[10px] ml-[430px] w-[150px] h-[30px]  bg-green-800 rounded-lg items-center]'>
    <h1 className='text-white font-bold'>Rules</h1>
    </div>
    <div className='absolute   mt-[10px] ml-[200px] w-[150px] h-[30px]  bg-green-800 rounded-lg items-center]'>
    <Link href='/gamehistory'>
    <h1 className='text-white font-bold'>Game History</h1>
    </Link>
    </div>


        <div className='bg-white w-[800px] h-[300px] ml-[105px] absolute mt-[100px]'>
        <ul className='mt-[10px] text-justify w-[700px] pl-[50px] leading-10 font-medium '>
        <li>
        1. Dus Ka Dum is a game with 12 numbers from 1 to 12, which is held in every 5 minutes.</li>
        <li>2. You can place number of bets in each draw before the timer reaches in last 10 seconds.</li>
        <li>3. In any time you can collect your tickets.you have to claim your tickets with it's ID, so that the winning amount will be added to your balance.</li>
        <li>4. There is an oppurtunity to cancel your bets before the draw</li>
        <li>5. The Maximum amount that can be placed in a single number: 5000</li>
        <li>6. The winning will be calculated as : bet placed on that number * 11</li>
        </ul>
        </div>
        <Link href='/bet'>
        <div className='absolute rounded-full text-white font-bold pt-[5px] bg-green-800 w-[40px] ml-[950px]  h-[40px] items-center]'>
                X
            </div>
            </Link>
    </div>
  )
}

export default rules
