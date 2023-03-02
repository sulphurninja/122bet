import mongoose from 'mongoose'

const betSchema = new mongoose.Schema({
  numberBets: {
    type: Map,
    of: Number
  },
  totalAmount: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
},
}, { collection: 'bets' });

module.exports = mongoose.model('Bet', betSchema);