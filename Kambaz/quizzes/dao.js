import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao(db) {
  function findQuizzesForCourse(courseId) {
    return model
      .find({ course: courseId })
      .sort({ availableDate: 1, _id: 1 });
  }

  function findQuizById(quizId) {
    return model.findById(quizId);
  }

  function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
  }

  function updateQuiz(quizId, quizUpdates) {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  }

  function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  function publishQuiz(quizId) {
    return model.updateOne({ _id: quizId }, { $set: { published: true } });
  }

  function unpublishQuiz(quizId) {
    return model.updateOne({ _id: quizId }, { $set: { published: false } });
  }

  async function addQuestion(quizId, question) {
    const newQuestion = {
      ...question,
      _id: uuidv4(),
    };
    await model.updateOne(
      { _id: quizId },
      { $push: { questions: newQuestion } },
    );
    return newQuestion;
  }

  async function updateQuestion(quizId, questionId, questionUpdates) {
    const quiz = await model.findById(quizId);
    if (!quiz) return null;
    const q = quiz.questions.find((x) => String(x._id) === String(questionId));
    if (!q) return null;
    const { _id: _ignored, ...rest } = questionUpdates;
    void _ignored;
    Object.assign(q, rest);
    await quiz.save();
    return q;
  }

  function deleteQuestion(quizId, questionId) {
    return model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } },
    );
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
