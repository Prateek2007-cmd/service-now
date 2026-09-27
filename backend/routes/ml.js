// Machine Learning Inference Routes for HERE Platform
import express from 'express';
import { classifySupportCase } from '../services/ml/mlClient.js';

const router = express.Router();

// POST /api/ml/classify
router.post('/classify', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'text field is required for classification' });
  }

  try {
    const result = await classifySupportCase(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'ML classification failed', details: err.message });
  }
});

export default router;
