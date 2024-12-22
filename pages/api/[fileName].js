// import fs from 'fs';
// import path from 'path';

// export default function handler(req, res) {
//   const { fileName } = req.query;
//   console.log(fileName);
//   const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
  
//   // Set CORS headers to allow localhost:3001 to fetch the file
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');  // Allow requests from localhost:3001
//   res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Handle preflight requests (OPTIONS method)
//   if (req.method === 'OPTIONS') {
//     res.status(204).end();
//     return;
//   }

//   // Handle file requests
//   if (req.method === 'GET') {
//     if (fs.existsSync(filePath)) {
//       res.setHeader('Content-Type', 'text/plain');  // Set appropriate content type for text files
//       const fileContent = fs.readFileSync(filePath, 'utf8');  // Read the file as a text
//       res.status(200).send(fileContent);
//     } else {
//       res.status(404).json({ error: 'File not found' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { fileName } = req.query;
  console.log('Received fileName:', fileName);
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002']; // Define allowed origins
  const origin = req.headers.origin;

  // Check if the origin is in the allowed list
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin); // Set the matching origin
  }

  // Set CORS headers
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // Allow requests from localhost:3001
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.status(204).end(); // No content for preflight response
    return;
  }

  // Handle GET requests for file content
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    if (fs.existsSync(filePath)) {
      try {
        console.log('cdsjknclcsdcasd')
       // console.log('Received fileName:', fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8'); // Read the file content
        res.setHeader('Content-Type', 'text/plain'); // Set content type for text files
        res.status(200).send(fileContent);
      } catch (err) {
        res.status(500).json({ error: 'Failed to read file', details: err.message });
      }
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

