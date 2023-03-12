import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import Modal from 'react-modal';
import { Howl } from 'howler';


const MyButtons = () => {

     const buttonClickSound = new Howl({
          src: ['/clear.mp3'],
     });
     const buttonClickSound2 = new Howl({
          src: ['/print.mp3'],
     });
     const buttonClickSound3 = new Howl({
          src: ['/select.mp3'],
     });


     const [selectedAmount, setSelectedAmount] = useState(0)
     const [numberBets, setNumberBets] = useState({})
     const [totalAmount, setTotalAmount] = useState(0)
     const { state = {}, dispatch } = useContext(DataContext)
     const { auth = {} } = state
     const [balance, setBalance] = useState(0)
     const router = useRouter()
     const [isModalOpen, setIsModalOpen] = useState(false);

     const [userName, setUserName] = useState("");

     useEffect(() => {
       if (auth && auth.user && auth.user.userName) {
         setUserName(auth.user.userName);
       }
       console.log(userName, "this is my user bitch")
     }, [auth]);
     

     console.log(numberBets)
     const handleAmountClick = (amount) => {
          setSelectedAmount(amount)
     }

     const handleNumberClick = (number) => {
          setNumberBets({ ...numberBets, [number]: (numberBets[number] || 0) + selectedAmount })
          setTotalAmount(totalAmount + selectedAmount)
     }

     const clearBets = () => {
          setSelectedAmount(0);
          setNumberBets({});
          setTotalAmount(0);
     }

     const customStyles = {
          content: {
               top: '50%',
               left: '50%',
               right: 'auto',
               bottom: 'auto',
               marginRight: '-50%',
               transform: 'translate(-50%, -50%)',
          },
     };

     useEffect(() => {

          if (Object.keys(auth).length > 0) {
               axios.get(`/api/user/balance?userName=${userName}`)
                    .then(response => {
                         setBalance(response.data.balance)
                         
                         console.log("trying to fetch balance", balance)
                    })
                    .catch(error => console.error(error))
          
          }
     }, [auth])

     const handlePlaceBets = async () => {
          if(totalAmount== 0){
               return;
          }else{
          try {
               // Deduct the totalAmount from the user's balance
               if (balance < totalAmount) {
                    setIsModalOpen(true);
               } else {
                    await axios.post('/api/pushBets', { numberBets, totalAmount, userName });
                    console.log('Bets published successfully!');
                    router.push('/Ticket');
               }
          } catch (error) {
               console.error(error);
               console.log('Failed to publish bets');
          }
     }
     };


     const InsufficientBalanceModal = ({ isOpen, onClose }) => {
          return (
               <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
                    <h2>Insufficient Balance</h2>
                    <p>Your balance is not enough to place these bets.</p>
                    <button onClick={onClose}>Close</button>
               </Modal>
          );
     };

     const handleLogout = () => {
          Cookie.remove('refreshtoken', { path: '/api/auth/refreshToken' })
          localStorage.removeItem('firstLogin')
          dispatch({ type: 'AUTH', payload: {} })
          router.push('/login')
     }

    

     const getCircleContent = (number) => {
          const amount = numberBets[number] || 0;
          return (
               <div className="relative  h-full">
                    <div className="absolute inset-0  flex items-center justify-center">
                         <div className="lg:mt-32 mt-16 lg:h-24 lg:w-24 h-12 w-12 lg:mb-[20px]  mb-[10px]   rounded-full   " />
                    </div>
                    {amount ? (
                         <div className="absolute inset-0 flex  text-center ml-auto mr-auto items-center justify-center">
                              <span className="text-gray-900 text-xl font-bold">{amount}</span>
                         </div>
                    ) : null}
               </div>
          );
     };

     const getCircle = () => {
          return (
               <div className="relative  h-full">
                    <div className="absolute inset-0  flex items-center justify-center">
                         <div className="lg:mt-32 mt-16 lg:h-24 lg:w-24 h-12 w-12 lg:mb-[20px] mb-[10px]   absolute rounded-full border-4  border-white" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">

                    </div>
               </div>
          );
     };
     return (
          <div className='flex w-3/4'>
               <div className='flex w-[40%]] '>
                    <div className="grid grid-cols-4 gap-4 gap-x-20  mt-1 justify-items-center ml-[5%]  text-lg mx-auto">

                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(number => (
                              <div className='cursor-pointer' onClick={() => { buttonClickSound3.play(); handleNumberClick(number) }}>
                                   <div>
                                        <div className="text-center text-white  bg-black text- mt-2">{getCircle()}</div>
                                        <div
                                             key={number}
                                             className={`rounded-full lg:h-28 lg:w-28 h-14  w-14 text-2xl  flex items-center justify-center cursor-pointer
            ${[1, 5, 9].includes(number) ? 'bg-red-500' : [3, 7, 11].includes(number) ? 'bg-green-500' : [2, 6, 10].includes(number) ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                             onClick={() => { buttonClickSound3.play(); handleNumberClick(number); }}
                                        >
                                             <span className="text-black text-4xl font-bold pb-[60px]">{number}</span>
                                             <div className="text-center text-white bg-black text-xl mt-2">{getCircleContent(number)}</div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                         <div className="col-span-4 ">
                              <div className="flex absolute justify-center">
                                   {[10, 20, 30, 100, 500].map(amount => (
                                        <img key={amount} onClick={() => { buttonClickSound3.play(); handleAmountClick(amount); }} className={`h-20 mx-2 my-4 cursor-pointer  w-full  ${amount === selectedAmount ? 'border-[10px] rounded-full border-white' : ''}`} src={`/${amount}.png`} />
                                   ))}

                              </div>
                         </div>
                    </div>
               </div>

               <div className='w-[30%]'>
                    <div className='text-white font-bold   border-amber-200 rounded-lg  '>
                         <h1 className='text-white font-bold mx-32 text-2xl'>Total: {totalAmount}</h1>
                         <button className="bg-red-200 rounded-full mx-32 my-8 w-24 h-24    text-black    font-bold py-2 px-4 " onClick={() => { buttonClickSound2.play(); handlePlaceBets(); }}><img className='w-16 h-16' src='/print.png' /> </button>
                         <InsufficientBalanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                         <button className='bg-red-400 rounded-full mx-32 my-8 w-24 h-24  text-black font-bold py-2 px-4' onClick={() => {
                              buttonClickSound.play();
                              clearBets();
                         }}><img className='w-16 h-16' src='/clear.png' /> </button>

                    </div>
               </div>
          </div >
     )
}

export default MyButtons