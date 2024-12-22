// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  secret: { type: String, required: true },
  category: { type: [String], required: true }, 
  password: { type: String, required: true } , 
  rank: { type: Number, required: true },
} , 
{
    collection: 'User', // Specify the exact collection name here
}

);

export default mongoose.models.User || mongoose.model('User', userSchema);
