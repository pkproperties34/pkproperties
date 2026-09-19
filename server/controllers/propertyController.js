import Property from '../models/Property.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { status, type, isFeatured, project } = req.query;
    let query = { isPublished: true };
    
    if (status) query.status = status;
    if (type) query.propertyType = type;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (project) query.project = project;

    const properties = await Property.find(query)
      .populate('project', 'name location')
      .populate('amenities')
      .sort({ createdAt: -1 });
      
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// @desc    Get property by slug
// @route   GET /api/properties/details/:slug
// @access  Public
export const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug, isPublished: true })
      .populate('project', 'name location highlights')
      .populate('amenities');
      
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: 'Invalid property data', error: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Property removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};
