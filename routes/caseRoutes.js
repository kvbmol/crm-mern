const express = require('express');
const router = express.Router();
const Case = require('../models/case'); 

// GET /cases - List all cases with customer data
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('customerId', 'name email phone')  // Join customer info
      .populate('assignedTo', 'name email')         // Join assigned user
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /cases/:id - Single case with relationships
router.get('/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('customerId', 'name email phone')
      .populate('assignedTo', 'name email');
    
    if (!caseItem) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({ success: true, data: caseItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /cases - Create new case
router.post('/', async (req, res) => {
  try {
    const caseData = {
      ...req.body,
      assignedTo: req.user.userId  // Auto-assign to logged-in user from JWT
    };
    
    const newCase = new Case(caseData);
    await newCase.save();
    
    const populatedCase = await Case.findById(newCase._id)
      .populate('customerId', 'name email phone')
      .populate('assignedTo', 'name email');
      
    res.status(201).json({ success: true, data: populatedCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /cases/:id - Update case (status, priority, etc.)
router.patch('/:id', async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .populate('customerId', 'name email phone')
    .populate('assignedTo', 'name email');
    
    if (!updatedCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    res.json({ success: true, data: updatedCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /cases/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    res.json({ success: true, message: 'Case deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
