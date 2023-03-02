import { useState, useEffect } from "react";
import React from "react";

export default function Time() {
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

    return (
        <div className="text-2xl ">
            <div className="flex justify-between items-center  text-white font-bold ">
                <p className="text-yellow-200  flex  items-center">
                    {timeToDraw}
                </p>
            </div>
        </div>
    );
}