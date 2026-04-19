import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  _id: String,
  text: String,
  isCorrect: Boolean,
});

const blankSchema = new mongoose.Schema({
  _id: String,
  correctAnswers: [String],
});

const questionSchema = new mongoose.Schema({
  _id: String,
  title: String,
  questionText: String,
  points: { type: Number, default: 1 },
  questionType: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    default: "MULTIPLE_CHOICE",
  },
  choices: [choiceSchema],
  correctAnswer: { type: Boolean, default: true },
  blanks: [blankSchema],
});

export default questionSchema;
