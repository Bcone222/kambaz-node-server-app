import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  function findAssignmentsForCourse(courseId) {
    return db.assignments.filter((a) => a.course === courseId);
  }

  function createAssignment(assignment) {
    const newAssignment = {
      ...assignment,
      _id: uuidv4(),
    };
    db.assignments = [...db.assignments, newAssignment];
    return newAssignment;
  }

  function deleteAssignment(assignmentId) {
    db.assignments = db.assignments.filter((a) => a._id !== assignmentId);
  }

  function updateAssignment(assignmentId, updates) {
    const assignment = db.assignments.find((a) => a._id === assignmentId);
    if (!assignment) return null;
    const { _id: _ignored, ...rest } = updates;
    Object.assign(assignment, rest);
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
