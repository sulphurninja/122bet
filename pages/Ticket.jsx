import React, { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import axios from 'axios'
import { v4 as uuidv4 } from "uuid"; // import the uuid library
import Barcode from 'react-barcode';
import { useRouter } from 'next/router';

const Ticket = () => {
  const [numberBets, setNumberBets] = useState();
  const [balance, setBalance] = useState(0);
  const { state = {}, dispatch } = useContext(DataContext)
  const { auth = {} } = state
  const getFormattedTime = () => {
    const date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let period = 'AM';

    if (hour >= 12) {
      period = 'PM';
      hour = hour % 12;
    }
    if (hour === 0) {
      hour = 12;
    }

    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute} ${period}`;
  }



  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (auth && auth.user && auth.user.userName) {
      setUserName(auth.user.userName);
    }
    console.log(userName, "this is my user bitch")
  }, [auth]);

  // Generate the barcode string

  const [barcodeValue, setBarcodeValue] = useState("");

  useEffect(() => {
    const uuid = uuidv4();
    const result = uuid.replace(/-/g, "").substring(0, 6);
    setBarcodeValue(result);
  }, []);


  //time

  const [time, setTime] = useState(getFormattedTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const [nextDraw, setNextDraw] = useState(new Date());
  const [nextDrawz, setNextDrawz] = useState(new Date());


  useEffect(() => {
    if (Object.keys(auth).length > 0) {
      axios.get(`/api/user/balance?userName=${auth.user.userName}`)
        .then(response => {
          setBalance(response.data.balance)
        })
        .catch(error => console.error(error))
    }
  }, [auth])

  useEffect(() => {
    const bettingStartTime = new Date(2023, 1, 7, 10, 0, 0); // 10:00 AM, February 7, 2023
    const now = new Date();
    const minutesSinceStart = (now - bettingStartTime) / (1000 * 60);
    const nextDrawMinutes = Math.ceil(minutesSinceStart / 5) * 5;
    setNextDraw(new Date(bettingStartTime.getTime() + nextDrawMinutes * 60 * 1000));
  }, []);

  let drawHour = nextDraw.getHours();
  let drawMinute = nextDraw.getMinutes().toString().padStart(2, '0');
  let drawPeriod = 'AM';

  if (drawHour >= 12) {
    drawPeriod = 'PM';
    drawHour = drawHour % 12;
  }
  if (drawHour === 0) {
    drawHour = 12;
  }

  const hours = drawHour.toString().padStart(2, '0');


  const formattedHours = nextDraw.getHours() > 12 ? nextDraw.getHours() - 12 : nextDraw.getHours();
  const formattedMinutes = nextDraw.getMinutes().toString().padStart(2, '0');
  const ampm = nextDraw.getHours() >= 12 ? 'PM' : 'AM';
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000);
    return () => clearInterval(interval);
  }, [])


  // fetch the winning number
  const [winningNumber, setUpcomingWinningNumber] = useState('');

  useEffect(() => {

    const bettingStartTime = new Date(2023, 1, 17, 10, 0, 0); // 10:00 AM, February 7, 2023
    const now = new Date();
    const minutesSinceStart = (now - bettingStartTime) / (1000 * 60);
    const nextDrawMinutes = Math.ceil(minutesSinceStart / 5) * 5;
    setNextDraw(new Date(bettingStartTime.getTime() + nextDrawMinutes * 60 * 1000));
  }, []);


  const drawTime = nextDraw.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(/^(\d{1}):/, '0$1:'); // add leading zero to hour if it's a single digit


  const prevDrawTime = useRef(drawTime);
  useEffect(() => {
    if (
      prevDrawTime.current !== drawTime
    ) {
      prevDrawTime.current = drawTime;

      async function fetchWinningNumber() {
        try {
          const response = await axios.get(`/api/getWinningNumber?drawTime=${drawTime}`);
          setUpcomingWinningNumber(response.data.winningNumber);
        
        } catch (error) {
          console.log('Error fetching winning number:', error);
          return null;
        }
      }
      fetchWinningNumber();
      console.log(winningNumber, drawTime, "WINNINGNUMBER AND DRAWTIME")
    }
  });

  const prevNumberBets = useRef(numberBets);
  const prevWinningNumber = useRef(winningNumber);
  const prevBarcodeValue = useRef(barcodeValue)

  useEffect(() => {
    if (
      prevNumberBets.current !== numberBets ||
      prevWinningNumber.current !== winningNumber || prevBarcodeValue.current !== barcodeValue || prevDrawTime.current !== drawTime
    ) {
      prevNumberBets.current = numberBets;
      prevWinningNumber.current = winningNumber;
      prevBarcodeValue.current = barcodeValue;
      prevDrawTime.current = drawTime;

      const generateBarcode = async (numberBets, winningNumber, barcodeValue, drawTime) => {
        if (!numberBets || !winningNumber) {
          // Return early if either numberBets or winningNumber is not available
          return;
        }

        try {
          await axios.post('/api/barcodes', { numberBets, drawTime, winningNumber, barcodeValue, drawTime });
          console.log('Barcode generated successfully!');
        } catch (error) {
          console.error('Failed to generate barcode:', error);
          console.log('Failed to generate barcode');
        }
      };

      generateBarcode(numberBets, winningNumber, barcodeValue, drawTime);
    }
  }, [winningNumber, numberBets, barcodeValue, drawTime]);


  // Fetch the user's bets
  useEffect(() => {
    if (userName) {
      const fetchNumberBets = async () => {
        try {
          const timestamp = new Date().getTime();
          const response = await axios.get(`/api/fetchBets?userName=${userName}&timestamp=${timestamp}`);
          if (response && response.data) {
            setNumberBets(response.data.data);
            console.log("check", response.data.data)
          } 
        } catch (error) {
          console.error(error);
        }
      };
      fetchNumberBets();
    }
  }, [userName]);

  useEffect(() => {
    console.log(numberBets)
  }, [numberBets])

  const Router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      window.print();

    }, 2000);

  },
    []);
  useEffect(() => {
    setTimeout(() => {
      Router.push('/bet')

    }, 3000);

  },
    []);



  return (
    <div className=' ml-[20px] mt-[0px] w-[196px] font-bold border-black border-2'>
      <h1>10 ka dam</h1>
      <h1>For Amusement Only</h1>
      {/* <h1 className='font-bold'>Agent: {auth.user.userName}</h1> */}
      <h1 className='font-bold'>Game Name: DUS MAIN HAI DUM</h1>
      <h1>Draw Time:  {formattedHours}:{formattedMinutes} {ampm}</h1>
      <h1>Ticket Time:{currentTime}</h1> {/**Print Time */}
      <h1>Ticket Amount:</h1> {/**Total Amount */}


      <div>
        <div>

          <div>
            <table className=''>
              <thead>
                <tr className=''>
                  <th className=''>Item</th>
                  <th className='absolute ml-[50px]'>Point</th>
                </tr>
              </thead>
              <tbody key={Date.now()}>
                {numberBets && Object.keys(numberBets).map((number) => (
                  <tr key={number}>
                    <td>{number}</td>
                    <td className='absolute ml-[50px]'>{numberBets[number]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='w-[100px]'>
              <Barcode value={barcodeValue} height={30} width={1.5} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Ticket;
