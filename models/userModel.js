import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default: 'user'
    },
    root:{
        type: Boolean,
        default:false
    },
    balance:{
        type: Number,
        default: 0
    },
  
});

userSchema.index({ userName: 1 });

let User = mongoose.models.user || mongoose.model('user', userSchema)
export default User
