import dbConnect from '@/lib/mongodb'; // Ensure this imports your dbConnect function
import Secret from '../../models/Secret';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await dbConnect();
      await Secret.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Secret deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting secret', error });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
