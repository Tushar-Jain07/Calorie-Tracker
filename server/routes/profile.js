import express from 'express';
import User from '../models/User.js';
import FoodEntry from '../models/FoodEntry.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile
router.put('/', auth, async (req, res, next) => {
  try {
    const { profile, preferences } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (profile) {
      Object.keys(profile).forEach(key => {
        if (key === 'targetMacros' && profile.targetMacros) {
          user.profile.targetMacros = { ...user.profile.targetMacros?.toObject?.() || {}, ...profile.targetMacros };
        } else {
          user.profile[key] = profile[key];
        }
      });
    }

    if (preferences) {
      if (preferences.units) {
        user.preferences.units = { ...user.preferences.units?.toObject?.() || {}, ...preferences.units };
      }
      if (preferences.dailyWaterGoal !== undefined) {
        user.preferences.dailyWaterGoal = preferences.dailyWaterGoal;
      }
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// GET /api/profile/stats
router.get('/stats', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalEntries = await FoodEntry.countDocuments({ userId: req.user.id });

    const uniqueDays = await FoodEntry.distinct('date', { userId: req.user.id });
    const daysLogged = uniqueDays.length;

    // Recent 7-day compliance
    const today = new Date();
    const last7Dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Dates.push(d.toISOString().split('T')[0]);
    }

    const recentEntries = await FoodEntry.find({
      userId: req.user.id,
      date: { $in: last7Dates }
    });

    const dailyCalories = {};
    recentEntries.forEach(e => {
      dailyCalories[e.date] = (dailyCalories[e.date] || 0) + e.calories;
    });

    const daysWithData = Object.keys(dailyCalories).length;
    const avgCalories = daysWithData > 0
      ? Math.round(Object.values(dailyCalories).reduce((a, b) => a + b, 0) / daysWithData)
      : 0;

    const compliance = user.profile.targetCalories && daysWithData > 0
      ? Math.round((avgCalories / user.profile.targetCalories) * 100)
      : 0;

    res.json({
      totalEntries,
      daysLogged,
      memberSince: user.createdAt,
      streak: user.streak,
      weeklyAvgCalories: avgCalories,
      weeklyCompliance: compliance
    });
  } catch (error) {
    next(error);
  }
});

export default router;
