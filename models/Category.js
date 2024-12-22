// models/User.js
import mongoose from 'mongoose';

const secretSchema = new mongoose.Schema(
  {
   
   
    category: { type: String, required: true }, // Updated to array of strings
  
  },
  {
    collection: 'Category', // Specify the exact collection name here
  }
);

export default mongoose.models.Category || mongoose.model('Category', secretSchema);
