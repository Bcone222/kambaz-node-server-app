import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function findAllCourses() {
    return model.find();
  }

  function createCourse(course) {
    const newCourse = {
      ...course,
      _id: course._id || uuidv4(),
      modules: course.modules || [],
      assignments: course.assignments || [],
    };
    return model.create(newCourse);
  }

  function deleteCourse(courseId) {
    return model.deleteOne({ _id: courseId });
  }

  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
