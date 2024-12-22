import dbConnect from '@/lib/mongodb'; // Ensure this imports your dbConnect function
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import jwt from 'jsonwebtoken';
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      if (req.headers.host !== 'localhost:3000') {
        return res.status(403).json({ error: 'Unauthorized origin' });
      }

      await dbConnect();

      const { email, password } = req.body;
      console.log(email , password)
      // Validation (e.g., checking for missing fields or invalid input)
      if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // // Hash the password using bcrypt
      // const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds (you can adjust this)
      // const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

       // Find the admin user by email
       const admin = await Admin.findOne({ email : email });

       // If no user is found, return error
       if (!admin) {
         return res.status(404).json({ error: 'Admin not found' });
       }
 
       // Compare the provided password with the hashed password in the database
       const isPasswordValid = await bcrypt.compare(password, admin.password);
       if (!isPasswordValid) {
         return res.status(401).json({ error: 'Invalid credentials' });
       }

       // Optional: Generate a JWT token for the admin
       const token = jwt.sign(
         { id: admin._id, email: admin.email }, // Payload
         process.env.JWT_SECRET, // Secret key from environment variable
         { expiresIn: '8h' } // Token expiry
       );
       res.setHeader(
        'Set-Cookie',
        `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; `
      );
      
       // Return success response with token
       return res.status(200).json({ type:'success', admin})
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Respond with a 405 Method Not Allowed if it's not a POST request
  return res.status(405).json({ error: 'Method Not Allowed' });
};
