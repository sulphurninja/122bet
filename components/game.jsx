import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import Buttons from '../components/Buttons'
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import axios from 'axios';
import Modal from '../components/Modal';
import ResultsTable from '../components/ResultsTable'
// import BetButtons from '../components/Buttons'

function bet() {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [barcode, setBarcode] = useState('');
    const [winningAmount, setWinningAmount] = useState(null);
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    const handleBarcodeChange = (event) => {
        setBarcode(event.target.value);
    };

    const handleBarcodeSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`/api/barcodes?barcodeValue=${barcode}&userName=${auth.user.userName}`);
            setWinningAmount(response.data.winningAmount);
            setShowModal(true);
            console.log(response.data.winningAmount)
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const handleScan = (event) => {
            const barcodeValue = event.target.value;
            setBarcode(barcodeValue);

        };

        window.addEventListener('keydown', handleScan);

        return () => {
            window.removeEventListener('keydown', handleScan);
        };
    }, []);


    return (

        <div className='w-screen h-screen relative bg-black'>

            <div className="">
                <video loop autoPlay={true} slice className='w-full h-full absolute' muted >
                    <source src="/video1.mp4" />
                </video>
            </div>
            <div className='absolute bg-black opacity-95 h-full w-full'>
                <Header />

                <div className='flex'>
                    <Buttons />
                    <ResultsTable />
                </div>

                <form onSubmit={handleBarcodeSubmit}>
                    <label htmlFor="barcode">Enter barcode:</label>
                    <div className=''>
                        <input type="text" value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            placeholder='Scan or Enter the barcode' className='bg-white  border-4 border-green-500 text-center h-[10%]  rounded-3xl ' />
                    </div>
                </form>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} winningAmount={winningAmount} />


                <div id='selectedBettingNumber' className="text-white"> </div>
                <div id='selectedBettingAmount' className="text-white"> </div>


                {/* <div id="placedBets" className="text-white"></div> */}

            </div>
        </div>
    )
}

export default bet