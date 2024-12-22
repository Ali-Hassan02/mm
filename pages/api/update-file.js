// import fs from 'fs';
// import path from 'path';

// // API route to handle file update
// export default function handler(req, res) {
//   if (req.method === 'POST') {
//     const { fileName, newContent } = req.body;

//     // Define the path to the file in the public/uploads directory
//     const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

//     // Ensure the file exists before attempting to update
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     // Write the new content to the file
//     fs.writeFile(filePath, newContent, (err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Failed to update file', error: err });
//       }
//       res.status(200).json({ message: 'File updated successfully' });
//     });
//   } else {
//     // Handle any non-POST requests
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Set CORS headers

  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002']; // Define allowed origins
  const origin = req.headers.origin;

  // Check if the origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Set the matching origin
  }
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Allow requests from localhost:3001
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow only POST and OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  // Handle preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.status(204).end(); // No content for preflight
    return;
  }

  if (req.method === 'POST') {
    const { fileName, newContent } = req.body;

    // Validate input
    if (!fileName || !newContent) {
      return res.status(400).json({ message: 'File name and content are required.' });
    }

    // Define the path to the file in the public/uploads directory
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Ensure the file exists before attempting to update
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Write the new content to the file
    fs.writeFile(filePath, newContent, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update file', error: err });
      }
      res.status(200).json({ message: 'File updated successfully' });
    });
  } else {
    // Handle any non-POST requests
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
