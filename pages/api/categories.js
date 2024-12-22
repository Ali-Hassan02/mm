import dbConnect from '@/lib/mongodb'; // Ensure this imports your dbConnect function
import Secret from '@/models/Secret';
import Category from '@/models/Category';



export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await dbConnect();

      const { category } = req.body;

      // Validation (e.g., checking for missing fields or invalid input)
      if (!category ) {
        return res.status(400).json({ error: 'Fill category' });
      }
      const existingSecret = await Category.findOne({ category });
      if (existingSecret) {
        return res.status(400).json({ error: 'Category already exists' });
      }

     
      // Save to the database
      const data = new Category({
        category
      });

      await data.save();
      res.status(201).json({ message: 'category created successfully', category : data});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error. Please try again.' });
    }
  } else {
      try {
        // Connect to the database
        await dbConnect();

        // Fetch all secrets from the database
        const secrets = await Category.find();

        // Respond with the fetched secrets
        res.status(200).json(secrets);
      } catch (error) {
        console.error('Error fetching secrets:', error);
        res.status(500).json({ error: 'Failed to fetch secrets' });
      }
  }
};
