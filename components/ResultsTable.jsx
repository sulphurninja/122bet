import { useState, useEffect } from "react";
import axios from "axios";

function ResultsTable() {
  const [results, setResults] = useState([]);
  const [drawTimes, setDrawTimes] = useState([]);

  const calculateDrawTimes = () => {
    const startDrawTime = new Date();
    startDrawTime.setMinutes(Math.floor(startDrawTime.getMinutes() / 5) * 5);
    startDrawTime.setSeconds(0);
    const drawTimes = Array(10)
      .fill()
      .map((_, index) => {
        const drawTime = new Date(
          startDrawTime.getTime() - index * 5 * 60 * 1000
        );
        return drawTime.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      });
    setDrawTimes(drawTimes);
  };

  const getPriorCopy = async (drawTime) => {
    try {
      const res = await axios.get(`/api/getPriorcopy?drawTime=${drawTime}`);
      return res.data.winningNumber;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    calculateDrawTimes();
  }, []);


  const fetchResults = async () => {
    const results = await Promise.all(
      drawTimes.map((drawTime) => getPriorCopy(drawTime))
    );
    setResults(results);
  };

  useEffect(() => {
      fetchResults();
  }, [drawTimes]);

  const getRowClassName = (winningNumber) => {
    if (winningNumber === 1 || winningNumber === 5 || winningNumber === 9) {
      return "bg-red-500";
    }
    if (winningNumber === 2 || winningNumber === 6 || winningNumber === 10) {
      return "bg-yellow-500";
    }
    if (winningNumber === 3 || winningNumber === 7 || winningNumber === 11) {
      return "bg-green-500";
    }
    if (winningNumber === 4 || winningNumber === 8 || winningNumber === 12) {
      return "bg-blue-500";
    }
  };
console.log(results)
  return (
    <div className=" ">
      <table className="text-white h-[400px] w-[400px] font-bold  text-center ">
        <thead>
          <tr className="">
            <th>Time</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {drawTimes.map((drawTime, index) => (
            <tr key={drawTime} className={getRowClassName(results[index])}>
              <td className="border-2">{drawTime}</td>
              <td className="border-2">{results[index] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;