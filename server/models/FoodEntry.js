import mongoose from 'mongoose';

const foodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    index: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack'
  },
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  servingGrams: {
    type: Number,
    required: [true, 'Serving size is required'],
    min: 0
  },
  calories: {
    type: Number,
    required: [true, 'Calories is required'],
    min: 0
  },
  protein: { type: Number, default: 0, min: 0 },
  fat: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fiber: { type: Number, default: 0, min: 0 },
  sugar: { type: Number, default: 0, min: 0 },
  usdaId: String
}, {
  timestamps: true
});

foodEntrySchema.index({ userId: 1, date: 1 });

const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);
export default FoodEntry;
