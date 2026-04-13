import { v4 as uuidv4 } from "uuid";
import model from "../courses/model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    const course = await model.findById(courseId);
    if (!course) return [];
    return course.assignments || [];
  }

  async function createAssignment(courseId, assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    delete newAssignment.course;
    await model.updateOne(
      { _id: courseId },
      { $push: { assignments: newAssignment } }
    );
    return newAssignment;
  }

  async function deleteAssignment(courseId, assignmentId) {
    return model.updateOne(
      { _id: courseId },
      { $pull: { assignments: { _id: assignmentId } } }
    );
  }

  async function updateAssignment(courseId, assignmentId, assignmentUpdates) {
    const course = await model.findById(courseId);
    if (!course) return null;
    const assignment = course.assignments.find(
      (a) => String(a._id) === String(assignmentId)
    );
    if (!assignment) return null;
    const { _id: _ignored, ...rest } = assignmentUpdates;
    void _ignored;
    Object.assign(assignment, rest);
    await course.save();
    return assignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
