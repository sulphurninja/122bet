import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set up the connection URL and database name
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const dbName = 'test';

  // Connect to the database
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('fetchResults');

    // Extract the draw time from the request payload
    const { drawTime } = req.query;

    // Get the current time
    const now = new Date();

    // If the current time is after the specified draw time, return an error
    const nextToDraw = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() + 1,
      0,
      0
    );
    if (nextToDraw > new Date(drawTime)) {
      return res.status(400).json({ message: 'Draw time has already passed' });
    }

    // Find the 10 most recent documents with the corresponding draw time
    const results = await collection.find({ drawTime: { $eq: drawTime } }).sort({ _id: -1 }).limit(10).toArray();

    // If no documents are found, return an error
    if (results.length === 0) {
      return res.status(404).json({ message: `No winning numbers found for draw time: ${drawTime}` });
    }

    // Return the winning numbers
    const winningNumbers = results.map(result => result.winningNumber);
    res.status(200).json({ winningNumbers });

  } catch (err) {
    console.log('Error connecting to database:', err);
    res.status(500).json({ message: 'Error connecting to database' });
  } finally {
    await client.close();
  }
}
