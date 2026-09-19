import SiteContent from '../models/SiteContent.js';

// Get Site Content
export const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ isConfig: true });
    
    // If it doesn't exist, create default content
    if (!content) {
      content = await SiteContent.create({ isConfig: true });
    }
    
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site content', error: error.message });
  }
};

// Update Site Content (Admin only)
export const updateSiteContent = async (req, res) => {
  try {
    const updatedContent = await SiteContent.findOneAndUpdate(
      { isConfig: true },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating site content', error: error.message });
  }
};

// Get Developer Settings (Env vars status)
export const getDeveloperSettings = async (req, res) => {
  try {
    const cloudinaryConfigured = !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;
    
    res.status(200).json({
      cloudinaryConfigured,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || ''
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching developer settings', error: error.message });
  }
};
