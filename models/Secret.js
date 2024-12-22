// models/User.js
import mongoose from 'mongoose';

const secretSchema = new mongoose.Schema(
  {
   
    secret: { type: String, required: true },
    category: { type: [String], required: true }, // Updated to array of strings
    fileName: { type: String, required: true },
    rank :  { type: Number, required: true },
  },
  {
    collection: 'Secret', // Specify the exact collection name here
  }
);

export default mongoose.models.secret || mongoose.model('secret', secretSchema);
