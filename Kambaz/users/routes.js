import UsersDao from "./dao.js";
import EnrollmentsDao from "../enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = (req, res) => {
    dao.deleteUser(req.params.userId);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => {
    res.json(dao.findAllUsers());
  };

  const findUserById = (req, res) => {
    const user = dao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    const existing = dao.findUserById(userId);
    if (!existing) {
      res.sendStatus(404);
      return;
    }
    const updated = { ...existing, ...userUpdates };
    dao.updateUser(userId, updated);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(enrollmentsDao.findEnrollmentsForUser(currentUser._id));
  };

  const enrollCurrentUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    enrollmentsDao.enrollUserInCourse(currentUser._id, req.body.courseId);
    res.sendStatus(200);
  };

  const unenrollCurrentUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    enrollmentsDao.unenrollUserFromCourse(
      currentUser._id,
      req.params.courseId
    );
    res.sendStatus(200);
  };

  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.post("/api/users/current/enrollments", enrollCurrentUserInCourse);
  app.delete(
    "/api/users/current/enrollments/:courseId",
    unenrollCurrentUserFromCourse
  );

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);

  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
}
