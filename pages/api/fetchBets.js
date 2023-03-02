import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const { userName } = req.query;

  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('bets');
    let cursor = collection.find({ userName });
    let sortedCursor = cursor.sort({ _id: -1 });
    let latestBet = await sortedCursor.next();

    if (latestBet) {
      res.status(200).json({ success: true, data: latestBet.numberBets });
    } else {
      res.status(404).json({ success: false, message: `No bets found for user ${userName}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to connect to database' });
  } finally {
    await client.close();
  }
}
