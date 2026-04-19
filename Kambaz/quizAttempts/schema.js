import mongoose from "mongoose";

const answerEntrySchema = new mongoose.Schema(
  {
    questionId: String,
    questionType: String,
    answer: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    user: { type: String, ref: "UserModel" },
    course: String,
    attemptNumber: { type: Number, default: 1 },
    answers: [answerEntrySchema],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" },
);

export default quizAttemptSchema;
