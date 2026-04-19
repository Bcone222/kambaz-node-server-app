import QuizzesDao from "./dao.js";

export default function QuizRoutes(app, db) {
  const dao = QuizzesDao(db);

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz);
  };

  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.publishQuiz(quizId);
    res.json(status);
  };

  const unpublishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.unpublishQuiz(quizId);
    res.json(status);
  };

  const addQuestionToQuiz = async (req, res) => {
    const { quizId } = req.params;
    const newQuestion = await dao.addQuestion(quizId, req.body);
    res.json(newQuestion);
  };

  const updateQuestionInQuiz = async (req, res) => {
    const { quizId, questionId } = req.params;
    const updated = await dao.updateQuestion(
      quizId,
      questionId,
      req.body,
    );
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };

  const deleteQuestionFromQuiz = async (req, res) => {
    const { quizId, questionId } = req.params;
    const status = await dao.deleteQuestion(quizId, questionId);
    res.json(status);
  };

  const findQuestionsForQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz.questions || []);
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);

  app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.put("/api/quizzes/:quizId/unpublish", unpublishQuiz);

  app.post("/api/quizzes/:quizId/questions", addQuestionToQuiz);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestionInQuiz);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestionFromQuiz);
}
