import mongoose from 'mongoose';

export interface ICard {
  id?: string;
  cardname: string;
  person_name?: string;
  action_name?: string;
  object_name?: string;
  card_number?: string;
  comments?: string | null;
}

const cardSchema = new mongoose.Schema<ICard>({
  cardname: {
    type: String,
    required: true,
    unique: true
  },
  person_name: String,
  action_name: String,
  object_name: String,
  card_number: String,
  comments: String
}, {
  timestamps: true
});

// Check if the model is already defined to prevent OverwriteModelError
const Card = mongoose.models.Card || mongoose.model<ICard>('Card', cardSchema);

export default Card; 