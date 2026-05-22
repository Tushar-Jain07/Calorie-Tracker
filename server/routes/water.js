import express from 'express';
import WaterLog from '../models/WaterLog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/water?date=YYYY-MM-DD
router.get('/', auth, async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    let log = await WaterLog.findOne({ userId: req.user.id, date });
    if (!log) {
      log = { date, glasses: 0 };
    }
    res.json({ log });
  } catch (error) {
    next(error);
  }
});

// POST /api/water
router.post('/', auth, async (req, res, next) => {
  try {
    const { date, glasses } = req.body;
    const logDate = date || new Date().toISOString().split('T')[0];

    const log = await WaterLog.findOneAndUpdate(
      { userId: req.user.id, date: logDate },
      { glasses: glasses || 0 },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ log });
  } catch (error) {
    next(error);
  }
});

// PUT /api/water/increment
router.put('/increment', auth, async (req, res, next) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const log = await WaterLog.findOneAndUpdate(
      { userId: req.user.id, date },
      { $inc: { glasses: 1 } },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ log });
  } catch (error) {
    next(error);
  }
});

// PUT /api/water/decrement
router.put('/decrement', auth, async (req, res, next) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const log = await WaterLog.findOne({ userId: req.user.id, date });
    if (log && log.glasses > 0) {
      log.glasses -= 1;
      await log.save();
      return res.json({ log });
    }
    res.json({ log: log || { date, glasses: 0 } });
  } catch (error) {
    next(error);
  }
});

export default router;
