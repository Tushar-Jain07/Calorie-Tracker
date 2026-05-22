import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: 20,
    max: 500
  }
}, {
  timestamps: true
});

weightLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WeightLog = mongoose.model('WeightLog', weightLogSchema);
export default WeightLog;
