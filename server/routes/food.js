import express from 'express';
import FoodEntry from '../models/FoodEntry.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/food?date=YYYY-MM-DD
router.get('/', auth, async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { userId: req.user.id };
    if (date) query.date = date;

    const entries = await FoodEntry.find(query).sort({ createdAt: 1 });
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

// GET /api/food/summary?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/summary', auth, async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const entries = await FoodEntry.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    // Group by date
    const daily = {};
    entries.forEach(e => {
      if (!daily[e.date]) {
        daily[e.date] = { calories: 0, protein: 0, fat: 0, carbs: 0, count: 0 };
      }
      daily[e.date].calories += e.calories;
      daily[e.date].protein += e.protein;
      daily[e.date].fat += e.fat;
      daily[e.date].carbs += e.carbs;
      daily[e.date].count += 1;
    });

    const days = Object.keys(daily).length;
    const totals = entries.reduce((acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

    res.json({
      daily,
      averages: days > 0 ? {
        calories: Math.round(totals.calories / days),
        protein: Math.round(totals.protein / days),
        fat: Math.round(totals.fat / days),
        carbs: Math.round(totals.carbs / days)
      } : null,
      totalEntries: entries.length,
      daysLogged: days
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/food
router.post('/', auth, async (req, res, next) => {
  try {
    const { date, mealType, name, servingGrams, calories, protein, fat, carbs, fiber, sugar, usdaId } = req.body;

    if (!name || calories === undefined || servingGrams === undefined) {
      return res.status(400).json({ message: 'Name, serving, and calories are required' });
    }

    const entry = await FoodEntry.create({
      userId: req.user.id,
      date: date || new Date().toISOString().split('T')[0],
      mealType: mealType || 'snack',
      name,
      servingGrams,
      calories,
      protein: protein || 0,
      fat: fat || 0,
      carbs: carbs || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      usdaId
    });

    // Update streak
    await updateStreak(req.user.id);

    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

// PUT /api/food/:id
router.put('/:id', auth, async (req, res, next) => {
  try {
    const entry = await FoodEntry.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const allowedFields = ['mealType', 'name', 'servingGrams', 'calories', 'protein', 'fat', 'carbs', 'fiber', 'sugar'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) entry[field] = req.body[field];
    });

    await entry.save();
    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/food/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const entry = await FoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
});

// Helper: Update user streak
async function updateStreak(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastLog = user.streak.lastLogDate
      ? new Date(user.streak.lastLogDate).toISOString().split('T')[0]
      : null;

    if (lastLog === today) return; // Already logged today

    if (lastLog === yesterday) {
      user.streak.current += 1;
    } else if (lastLog !== today) {
      user.streak.current = 1;
    }

    if (user.streak.current > user.streak.longest) {
      user.streak.longest = user.streak.current;
    }

    user.streak.lastLogDate = new Date();
    await user.save();
  } catch (error) {
    console.error('Streak update error:', error);
  }
}

export default router;
