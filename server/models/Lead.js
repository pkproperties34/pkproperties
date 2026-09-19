import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  message: { type: String },
  source: { type: String, default: 'Website' }, // Website, Meta, Google, Walk-in
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Follow Up', 'Site Visit Scheduled', 'Site Visit Completed', 'Negotiation', 'Converted', 'Lost'],
    default: 'New'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['Enquiry', 'Site Visit'],
    default: 'Enquiry'
  },
  // Specific to Site Visits
  preferredDate: { type: Date },
  preferredTime: { type: String },
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
