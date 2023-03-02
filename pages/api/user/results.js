import mongodb from 'mongodb';

export default async (req, res) => {
  const client = await mongodb.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = client.db('test');
  const resultsCollection = db.collection('fetchResults');

  const results = await resultsCollection.find({}).toArray();

  res.json(results);
};
