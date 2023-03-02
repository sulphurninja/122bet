import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bet: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Bet',
        required: true
    },
   
    balance: {
        type: Number,
        required: true
    },
})

let User = mongoose.models.user || mongoose.model('user', userSchema)
export default User
