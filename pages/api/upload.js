import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for handling files
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const busboy = (await import('busboy')).default;

    const bb = busboy({ headers: req.headers });

    const uploadFolder = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    bb.on('file', (fieldname, file, filename) => {
      const saveTo = path.join(uploadFolder, filename.filename);
      file.pipe(fs.createWriteStream(saveTo));
    });

    bb.on('finish', () => {
      res.status(200).json({ message: 'File uploaded successfully!' });
    });

    req.pipe(bb);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
// import dbConnect from '@/lib/mongodb'; // Import your dbConnect function
// import UploadedFile from '@/models/UploadedFile'; // The file model
// import fs from 'fs'; // For file handling
// import path from 'path'; // For file path manipulation
// import formidable from 'formidable'; // For handling form data (file upload)

// export const config = {
//   api: {
//     bodyParser: false, // Disable Next.js body parser to handle file uploads with formidable
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     // Connect to the database
//     await dbConnect();

//     // Handle file upload using formidable
//     const form = new formidable.IncomingForm();
//     form.uploadDir = path.join(process.cwd(), '/public/uploads'); // Specify folder for uploaded files
//     form.keepExtensions = true; // Keep file extensions (e.g., .jpg, .pdf)

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         return res.status(500).json({ error: 'File upload error' });
//       }

//       // Extract the form data
//       const { secretName, category } = fields;
//       const file = files.file[0]; // Get the uploaded file

//       // Ensure file and other fields are provided
//       if (!secretName || !category || !file) {
//         return res.status(400).json({ error: 'All fields are required' });
//       }

//       // Save the file info to MongoDB
//       const newUploadedFile = new UploadedFile({
//         secretName,
//         category,
//         fileName: file.originalFilename,
//         filePath: `/uploads/${file.newFilename}`, // Relative path to the uploaded file
//       });

//       try {
//         // Save the record to MongoDB
//         await newUploadedFile.save();

//         return res.status(200).json({
//           message: 'File uploaded and data saved successfully',
//           file: newUploadedFile,
//         });
//       } catch (error) {
//         return res.status(500).json({ error: 'Error saving file info to database' });
//       }
//     });
//   } else {
//     // Handle other HTTP methods
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
