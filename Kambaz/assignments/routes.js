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

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findAssignmentsForCourse(courseId));
  };

  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const created = dao.createAssignment(assignment);
    res.json(created);
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    dao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const updated = dao.updateAssignment(assignmentId, req.body);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  };

  app.get(
    "/api/courses/:courseId/assignments",
    requireUser,
    findAssignmentsForCourse,
  );
  app.post(
    "/api/courses/:courseId/assignments",
    requireUser,
    requireAssignmentEditorRole,
    createAssignmentForCourse,
  );
  app.delete(
    "/api/assignments/:assignmentId",
    requireUser,
    requireAssignmentEditorRole,
    deleteAssignment,
  );
  app.put(
    "/api/assignments/:assignmentId",
    requireUser,
    requireAssignmentEditorRole,
    updateAssignment,
  );
}
