const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });
import Users from '../../models/userModel'

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { numberBets, drawTime, winningNumber, barcodeValue } = req.body
      await client.connect();
      const db = client.db('test');
      let winningAmount = 0;
      if (numberBets.hasOwnProperty(winningNumber)) {
        winningAmount = numberBets[winningNumber] * 11;
      }
      const result = await db.collection('barcodes').insertOne({
        numberBets: numberBets,
        drawTime: drawTime,
        winningNumber: winningNumber,
        barcodeValue: barcodeValue,
        winningAmount: winningAmount,
        created: new Date()
      })

      res.status(200).json({ id: result.insertedId })
    } else if (req.method === 'GET') {
      await client.connect();
      const db = client.db('test');
      const barcode = req.query.barcodeValue
      const { userName } = req.query;
      const user = await Users.findOne({ userName });
      if (!barcode) {
        res.status(400).json({ message: 'Barcode is required' });
        return;
      }console.log(barcode)
      const resultz = await db.collection('barcodes').findOne({ barcodeValue: barcode });

      if (!resultz) {
        res.status(404).json({ message: 'Barcode not found' });
        return;
      }

      const winningNumber = resultz.winningNumber;
      const numberBets = resultz.numberBets;
      let winningAmount = 0;

      if (numberBets[winningNumber]) {
        winningAmount = numberBets[winningNumber] * 11;
      }

      res.status(200).json({ winningAmount });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.balance += winningAmount;
      await user.save();
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    await client.close();
  }
}