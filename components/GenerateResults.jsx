import axios from 'axios';
import { useState } from 'react';

const GenerateResultsButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
    const response = await axios.post('/api/generateResults');
    console.log(response.data.message); // or display a success message to the user
  } catch (error) {
    console.error(error);
  }
};

  return (
    <button className='text-green-800 ml-[500px] bg-white w-[100px]' onClick={handleClick} >
     Generate Results
    </button>
  );
};

export default GenerateResultsButton;
