import Users from '../../models/userModel';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
await client.connect();

export default async function handler(req, res) {
  try {
    const db = client.db('test');
    const collection = db.collection('bets');
    const { numberBets, totalAmount, userName } = req.body;
  

    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    else {
      const result = await collection.insertOne({ numberBets, totalAmount, userName });
      user.balance -= totalAmount;
      await user.save();

      return res.status(200).json({ success: true, data: result, balance: user.balance });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to connect to database' });
  } finally {
    await client.close();
  }
};
