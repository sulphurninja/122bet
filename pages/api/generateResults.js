import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'fetchResults.json');

  // Generate the list of draw times
  const startHour = 1;
  const startMinute = 0;
  const interval = 5;
  const numDraws = 288;

  const drawTimes = {};
  for (let hour = startHour; hour <= 12; hour++) {
    for (let minute = startMinute; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      drawTimes[`${time} AM`] = null;
      drawTimes[`${time} PM`] = null;
    }
  }

  // Generate the list of documents
  const data = {};
  for (let i = 0; i < numDraws; i++) {
    const winningNumber = Math.floor(Math.random() * 12) + 1;
    const drawTime = Object.keys(drawTimes)[i];
    data[drawTime] = winningNumber;
  }

  // Write the data to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(data));

  res.status(200).json({ message: 'Data saved successfully' });
}
