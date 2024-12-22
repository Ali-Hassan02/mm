// models/User.js
import mongoose from 'mongoose';

const secretSchema = new mongoose.Schema(
  {
   
    secret: { type: String, required: true },
   
    rank :  { type: Number, required: true },
  },
  {
    collection: 'SecretType', // Specify the exact collection name here
  }
);

export default mongoose.models.SecretType || mongoose.model('SecretType', secretSchema);
