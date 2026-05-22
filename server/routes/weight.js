import express from 'express';
import WeightLog from '../models/WeightLog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/weight?limit=30
router.get('/', auth, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const logs = await WeightLog.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(limit);
    res.json({ logs: logs.reverse() });
  } catch (error) {
    next(error);
  }
});

// POST /api/weight
router.post('/', auth, async (req, res, next) => {
  try {
    const { date, weight } = req.body;
    if (!weight) {
      return res.status(400).json({ message: 'Weight is required' });
    }

    const logDate = date || new Date().toISOString().split('T')[0];

    const log = await WeightLog.findOneAndUpdate(
      { userId: req.user.id, date: logDate },
      { weight },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ log });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/weight/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const log = await WeightLog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!log) {
      return res.status(404).json({ message: 'Weight log not found' });
    }
    res.json({ message: 'Weight log deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
