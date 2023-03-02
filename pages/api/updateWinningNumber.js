import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const { winningNumber } = req.body;
  const nextToDrawtime = req.body;
  console.log(nextToDrawtime.nextToDrawtime);
  let client = null; // Initialize client to null

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();
    const collection = db.collection('fetchResults');
    const result = await collection.updateOne(
      { drawTime:  nextToDrawtime.nextToDrawtime },
    
      { $set: { winningNumber } }
    );
    console.log(`Updated ${result.modifiedCount} documents`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  } finally {
    // Close the connection after use if client is not null
    if (client) {
      client.close();
    }
  }
}
