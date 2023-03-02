import Users from '../../models/userModel'

export default async (req, res) => {
  try {
    const { userName, totalAmount } = req.body;
    const user = await Users.findOne({ userName });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.balance -= totalAmount;
    await user.save();

    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
