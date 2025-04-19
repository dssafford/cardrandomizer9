import mongoose from 'mongoose';
import { ICard } from './Card';

const WrongCardSchema = new mongoose.Schema({
  cardname: { type: String, required: true, unique: true },
  person_name: { type: String, required: true },
  action_name: { type: String, required: true },
  object_name: { type: String, required: true },
  mistakeCount: { type: Number, default: 1 },
  lastMistakeDate: { type: Date, default: Date.now },
  userAnswer: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

export interface IWrongCard extends Omit<ICard, '_id'> {
  _id?: string;
  mistakeCount: number;
  lastMistakeDate: Date;
  userAnswer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Check if the model exists before creating a new one
const WrongCard = mongoose.models.WrongCard || mongoose.model('WrongCard', WrongCardSchema);
export default WrongCard; 