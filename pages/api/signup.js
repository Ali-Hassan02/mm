import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb'; // Ensure this imports your dbConnect function
import User from '@/models/User';

const assignRank = async (secretType) => {
  // Define the default ranks based on the secret types
  const rankMapping = {
    'Top Secret': 1,
    'Secret': 2,
    'Confidential': 3,
    'Private': 4,
    'Restricted': 5,
  };

  // Check if the secret type exists in our rank mapping
  if (rankMapping[secretType]) {
    return rankMapping[secretType]; // Return the mapped rank
  } else {
    // If it's a new secret type, find the max rank in the User collection and assign the next one
    const maxRankUser = await User.findOne().sort('-rank').limit(1);
    const newRank = maxRankUser ? maxRankUser.rank + 1 : 1; // If no user is found, start from rank 1
    return newRank;
  }
};

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await dbConnect();

      const { email, secret, category, password } = req.body;

      // Validation
      if (!secret || !Array.isArray(category) || category.length === 0) {
        return res.status(400).json({ error: 'All fields are required, and category must be an array.' });
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);  // Hash with salt rounds (10 is commonly used)

      const rank = await assignRank(secret);  // Your rank assignment logic

      // Save the user to the database
      const data = new User({
        email,
        secret,
        category,
        password: hashedPassword,  // Save hashed password
        rank
      });

      await data.save();
      res.status(201).json({ message: 'Sign Up successfully', secret: data });
    } catch (error) {
      console.error('Error during signup:', error);  // Log the error
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  } else {
    // Handle GET requests to fetch secrets (if needed)
    try {
      // Connect to the database
      await dbConnect();

      // Fetch all users from the database (if needed for listing)
      const users = await User.find();

      // Respond with the fetched users (if needed)
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
};
