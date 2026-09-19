import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  location: {
    address: { type: String, required: true },
    lat: Number,
    lng: Number,
    mapUrl: String
  },
  propertyType: { type: String, required: true },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Ready to Move', 'Completed'],
    required: true
  },
  startingPrice: { type: Number, required: true },
  configurations: [{ type: String }],
  description: { type: String, required: true },
  highlights: {
    landArea: String,
    towers: Number,
    floors: Number,
    units: Number,
    possession: String,
    reraInfo: String
  },
  coverImage: { type: String }, // Cloudinary URL
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
