import Lead from '../models/Lead.js';
import { sendEmail } from '../utils/email.js';

// @desc    Submit a new lead (Enquiry / Site Visit)
// @route   POST /api/leads
// @access  Public
export const createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    
    // Send email notification to Admin regarding new lead
    if (process.env.SMTP_USER) {
      sendEmail({
        email: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        subject: `New Lead: ${savedLead.type} from ${savedLead.name}`,
        message: `A new lead has been submitted.\n\nName: ${savedLead.name}\nPhone: ${savedLead.phone}\nEmail: ${savedLead.email || 'N/A'}\nSource: ${savedLead.source}\nMessage: ${savedLead.message || 'N/A'}`
      });
    }
    
    res.status(201).json({ message: 'Enquiry submitted successfully', leadId: savedLead._id });
  } catch (error) {
    res.status(400).json({ message: 'Invalid lead data', error: error.message });
  }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin/Sales
export const getLeads = async (req, res) => {
  try {
    const { status, type, project } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (project) query.project = project;

    const leads = await Lead.find(query)
      .populate('project', 'name')
      .populate('property', 'title')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

// @desc    Update lead status or details
// @route   PUT /api/leads/:id
// @access  Private/Admin/Sales
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private/Admin/Sales
export const addLeadNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    lead.notes.push({
      content: req.body.content,
      createdBy: req.user._id
    });
    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    res.status(400).json({ message: 'Error adding note', error: error.message });
  }
};
