// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
} , 
{
    collection: 'admin', // Specify the exact collection name here
}

);

export default mongoose.models.admin || mongoose.model('admin', userSchema);
