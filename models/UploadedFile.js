import mongoose from 'mongoose';

const uploadedFileSchema = new mongoose.Schema({
  secretName: { type: String, required: true },
  category: { type: String, required: true },
  fileName: { type: String, required: true }, // File name
  filePath: { type: String, required: true }, // Path to the uploaded file in the public folder
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.UploadedFile || mongoose.model('UploadedFile', uploadedFileSchema);
