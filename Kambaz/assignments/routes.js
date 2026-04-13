import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const requireUser = (req, res, next) => {
    if (!req.session["currentUser"]) {
      res.sendStatus(401);
      return;
    }
    next();
  };

  const requireAssignmentEditorRole = (req, res, next) => {
    const u = req.session["currentUser"];
    if (!["FACULTY", "ADMIN", "TA"].includes(u.role)) {
      res.sendStatus(403);
      return;
    }
    next();
  };

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignment = { ...req.body };
    const newAssignment = await dao.createAssignment(courseId, assignment);
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const { courseId, assignmentId } = req.params;
    const status = await dao.deleteAssignment(courseId, assignmentId);
    res.json(status);
  };

  const updateAssignment = async (req, res) => {
    const { courseId, assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(
      courseId,
      assignmentId,
      assignmentUpdates
    );
    if (!status) {
      res.sendStatus(404);
      return;
    }
    res.json(status);
  };

  app.get(
    "/api/courses/:courseId/assignments",
    requireUser,
    findAssignmentsForCourse
  );
  app.post(
    "/api/courses/:courseId/assignments",
    requireUser,
    requireAssignmentEditorRole,
    createAssignmentForCourse
  );
  app.delete(
    "/api/courses/:courseId/assignments/:assignmentId",
    requireUser,
    requireAssignmentEditorRole,
    deleteAssignment
  );
  app.put(
    "/api/courses/:courseId/assignments/:assignmentId",
    requireUser,
    requireAssignmentEditorRole,
    updateAssignment
  );
}
