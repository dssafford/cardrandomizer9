import mongoose from 'mongoose';

const WrongAnswerSchema = new mongoose.Schema({
  cardname: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true }
});

const SettingsSchema = new mongoose.Schema({
  selectedSuit: { type: String, default: null },
  chunkSize: { type: Number, required: true }
});

const TestResultSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalTime: { type: Number, required: true },  // seconds
  totalCards: { type: Number, required: true },
  wrongAnswers: [WrongAnswerSchema],
  score: { type: Number, required: true },  // percentage as a number
  settings: SettingsSchema
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

export interface IWrongAnswer {
  cardname: string;
  userAnswer: string;
  correctAnswer: string;
}

export interface ITestSettings {
  selectedSuit: string | null;
  chunkSize: number;
}

export interface ITestResult {
  _id?: string;
  date: Date;
  totalTime: number;
  totalCards: number;
  wrongAnswers: IWrongAnswer[];
  score: number;  // percentage as a number
  settings: ITestSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

// Check if the model exists before creating a new one
const TestResult = mongoose.models.TestResult || mongoose.model('TestResult', TestResultSchema);
export default TestResult; 