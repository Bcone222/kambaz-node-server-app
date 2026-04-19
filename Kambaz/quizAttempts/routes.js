import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../quizzes/dao.js";

function toBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function gradeAnswers(quiz, submittedAnswers) {
  const questions = quiz.questions || [];
  let score = 0;
  const answers = [];

  for (const sub of submittedAnswers || []) {
    const questionId = String(sub.questionId);
    const q = questions.find((x) => String(x._id) === questionId);
    const questionType =
      sub.questionType || (q ? q.questionType : undefined) || "";

    answers.push({
      questionId,
      questionType,
      answer: sub.answer,
    });

    if (!q) continue;

    if (q.questionType === "FILL_IN_BLANK") {
      continue;
    }

    if (q.questionType === "MULTIPLE_CHOICE") {
      const choiceId = sub.answer != null ? String(sub.answer) : "";
      const choice = (q.choices || []).find((c) => String(c._id) === choiceId);
      if (choice && choice.isCorrect) {
        score += q.points ?? 0;
      }
    } else if (q.questionType === "TRUE_FALSE") {
      const userVal = toBool(sub.answer);
      const correctVal = q.correctAnswer === true;
      if (userVal === correctVal) {
        score += q.points ?? 0;
      }
    }
  }

  return { score, answers };
}

export default function QuizAttemptRoutes(app, db) {
  const dao = QuizAttemptsDao(db);
  const quizzesDao = QuizzesDao(db);

  const getAttemptsForQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { quizId } = req.params;
    const attempts = await dao.findAttemptsForQuizByUser(quizId, currentUser._id);
    res.json(attempts);
  };

  const getAttemptById = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { attemptId } = req.params;
    const attempt = await dao.findAttemptById(attemptId);
    if (!attempt) {
      res.sendStatus(404);
      return;
    }
    if (String(attempt.user) !== String(currentUser._id)) {
      res.sendStatus(403);
      return;
    }
    res.json(attempt);
  };

  const submitAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const { quizId } = req.params;
    const { answers: submittedAnswers } = req.body || {};

    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }

    const count = await dao.countAttemptsForQuizByUser(quizId, currentUser._id);
    const multipleAttempts = Boolean(quiz.multipleAttempts);
    const maxAttempts = quiz.howManyAttempts ?? 1;

    if (!multipleAttempts && count >= 1) {
      res.status(403).send("No more attempts allowed");
      return;
    }
    if (multipleAttempts && count >= maxAttempts) {
      res.status(403).send("Maximum attempts reached");
      return;
    }

    const { score, answers } = gradeAnswers(quiz, submittedAnswers);

    const created = await dao.createAttempt({
      quiz: quizId,
      user: currentUser._id,
      course: quiz.course,
      attemptNumber: count + 1,
      answers,
      score,
    });

    const doc = Array.isArray(created) ? created[0] : created;
    res.json(doc);
  };

  app.get("/api/quizzes/:quizId/attempts", getAttemptsForQuiz);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
  app.get("/api/quizAttempts/:attemptId", getAttemptById);
}
