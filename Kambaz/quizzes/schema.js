import mongoose from "mongoose";
import questionSchema from "./questionSchema.js";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    course: { type: String, ref: "CourseModel" },
    points: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    quizType: {
      type: String,
      enum: [
        "Graded Quiz",
        "Practice Quiz",
        "Graded Survey",
        "Ungraded Survey",
      ],
      default: "Graded Quiz",
    },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    timeLimitEnabled: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: Boolean, default: false },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    questions: [questionSchema],
  },
  { collection: "quizzes" },
);

export default quizSchema;
