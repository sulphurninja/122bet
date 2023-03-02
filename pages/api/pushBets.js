import { MongoClient } from 'mongodb';
import Users from '../../models/userModel';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('bets');
    const { numberBets, totalAmount } = req.body;
    const userName = req.body.auth.user.userName; // extract username from request body


    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    else {
      const result = await collection.insertOne({ numberBets, totalAmount, userName });
      res.status(200).json({ success: true, data: result });
      user.balance -= totalAmount;
      await user.save();

      return res.status(200).json({ balance: user.balance });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to connect to database' });
  } finally {
    await client.close();
  }
};
