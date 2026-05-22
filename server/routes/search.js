import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/search/food?q=chicken
router.get('/food', auth, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    const apiKey = process.env.USDA_API_KEY;
    if (!apiKey || apiKey === 'your_usda_api_key_here') {
      return res.json({ foods: [], message: 'USDA API key not configured' });
    }

    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(q)}&pageSize=10`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ message: 'USDA API request failed' });
    }

    const data = await response.json();

    const foods = (data.foods || []).map(f => {
      const nutrients = {};
      (f.foodNutrients || []).forEach(n => {
        if (n.nutrientName === 'Energy' && n.unitName === 'KCAL') nutrients.calories = n.value;
        if (n.nutrientName === 'Protein') nutrients.protein = n.value;
        if (n.nutrientName === 'Total lipid (fat)') nutrients.fat = n.value;
        if (n.nutrientName === 'Carbohydrate, by difference') nutrients.carbs = n.value;
        if (n.nutrientName === 'Fiber, total dietary') nutrients.fiber = n.value;
        if (n.nutrientName === 'Sugars, total including NLEA') nutrients.sugar = n.value;
      });

      return {
        fdcId: f.fdcId,
        name: f.description,
        brand: f.brandName || f.brandOwner || '',
        servingSize: f.servingSize || 100,
        servingUnit: f.servingSizeUnit || 'g',
        nutrients
      };
    });

    res.json({ foods });
  } catch (error) {
    next(error);
  }
});

export default router;
