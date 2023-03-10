import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Extract the draw time from the request query parameters
    const { drawTime } = req.query;

    // Read the winning numbers from the JSON file
    const filePath = path.join(process.cwd(), 'data', 'fetchResults.json');
    const jsonData = fs.readFileSync(filePath);
    const winningNumbers = JSON.parse(jsonData);

    // Find the winning number for the corresponding draw time
    const winningNumber = winningNumbers[drawTime];

    // If a winning number is found, return it
    if (winningNumber) {
      res.status(200).json({ winningNumber });
    } else {
      res.status(404).json({ message: `No winning number found for draw time: ${drawTime}` });
    }
  } catch (err) {
    console.log('Error reading winning numbers from JSON file:', err);
    res.status(500).json({ message: 'Error reading winning numbers from JSON file' });
  }
}
