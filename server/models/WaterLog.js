import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
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
  glasses: {
    type: Number,
    required: true,
    min: 0,
    max: 30,
    default: 0
  }
}, {
  timestamps: true
});

waterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model('WaterLog', waterLogSchema);
export default WaterLog;
