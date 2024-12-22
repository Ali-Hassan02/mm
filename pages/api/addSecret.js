import dbConnect from '@/lib/mongodb'; // Ensure this imports your dbConnect function
import Secret from '@/models/Secret';
import SecretType from '@/models/SecretType';

const assignRank = async (secretType) => {
  // Define the default ranks based on the secret types
  const rankMapping = {
    'Top Secret': 1,
    'Secret': 2,
    'Confidential': 3,
    'Private': 4,
    'Restricted': 5,
    // Add more secret types and ranks as needed
  };

  // Check if the secret type exists in our rank mapping
  if (rankMapping[secretType]) {
    return rankMapping[secretType]; // Return the mapped rank
  } else {
    // If it's a new secret type, find the max rank in the database and assign the next one
    const maxRankSecret = await Secret.findOne().sort('-rank').limit(1);
    const newRank = maxRankSecret ? maxRankSecret.rank + 1 : 1; // If no secret is found, start from rank 1
    return newRank;
  }
};



export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await dbConnect();

      const { secret } = req.body;

      // Validation (e.g., checking for missing fields or invalid input)
      if (!secret ) {
        return res.status(400).json({ error: 'Fill Secret' });
      }
      const existingSecret = await SecretType.findOne({ secret });
      if (existingSecret) {
        return res.status(400).json({ error: 'Secret already exists' });
      }

      const rank = await assignRank(secret);
      // Save to the database
      const data = new SecretType({
        secret,
        
        rank
      });

      await data.save();
      res.status(201).json({ message: 'Secret created successfully', secret : data});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error. Please try again.' });
    }
  } else {
      try {
        // Connect to the database
        await dbConnect();

        // Fetch all secrets from the database
        const secrets = await SecretType.find();

        // Respond with the fetched secrets
        res.status(200).json(secrets);
      } catch (error) {
        console.error('Error fetching secrets:', error);
        res.status(500).json({ error: 'Failed to fetch secrets' });
      }
  }
};
