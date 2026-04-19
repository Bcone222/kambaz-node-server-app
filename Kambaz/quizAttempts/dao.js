import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao(db) {
  function findAttemptsForQuizByUser(quizId, userId) {
    return model
      .find({ quiz: quizId, user: userId })
      .sort({ attemptNumber: 1 });
  }

  function findAttemptById(attemptId) {
    return model.findById(attemptId);
  }

  function createAttempt(attempt) {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
  }

  function countAttemptsForQuizByUser(quizId, userId) {
    return model.countDocuments({ quiz: quizId, user: userId });
  }

  return {
    findAttemptsForQuizByUser,
    findAttemptById,
    createAttempt,
    countAttemptsForQuizByUser,
  };
}
