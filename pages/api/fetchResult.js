const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

export default async function handler (req, res) {
  try {
    console.log('Received data:', req.body);
    await client.connect();
    const collection = client.db("test").collection("fetchResults");
    let cursor = collection.find({}).sort({ _id: -1 });
    let data = await cursor.toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
  await client.close();
};
