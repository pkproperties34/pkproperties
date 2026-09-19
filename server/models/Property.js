import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Optional reference to a parent project
  location: { type: String, required: true },
  price: { type: Number, required: true },
  propertyType: { type: String, required: true },
  bedrooms: Number,
  bathrooms: Number,
  area: String,
  status: {
    type: String,
    enum: ['Available', 'Sold Out', 'Upcoming'],
    default: 'Available'
  },
  images: [{ type: String }], // Cloudinary URLs
  description: { type: String, required: true },
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  floorPlan: String, // Cloudinary URL
  brochure: String, // Cloudinary URL to PDF
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Property', propertySchema);
