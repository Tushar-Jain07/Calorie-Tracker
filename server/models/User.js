import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters']
  },
  profile: {
    age: { type: Number, min: 13, max: 120 },
    sex: { type: String, enum: ['male', 'female', ''] },
    heightCm: { type: Number, min: 50, max: 300 },
    weightKg: { type: Number, min: 20, max: 500 },
    activityLevel: { type: Number, min: 1, max: 2.5 },
    goal: { type: String, enum: ['loss', 'maintenance', 'gain', ''] },
    deficitPercent: { type: Number, min: 5, max: 30 },
    surplusPercent: { type: Number, min: 5, max: 20 },
    targetCalories: Number,
    bmr: Number,
    tdee: Number,
    targetMacros: {
      protein: Number,
      fat: Number,
      carbs: Number
    }
  },
  preferences: {
    units: {
      weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
      height: { type: String, enum: ['cm', 'ft'], default: 'cm' }
    },
    dailyWaterGoal: { type: Number, default: 8 }
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastLogDate: Date
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
