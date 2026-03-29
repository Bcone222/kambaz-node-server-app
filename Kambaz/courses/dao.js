import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }

  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  function deleteCourse(courseId) {
    db.courses = db.courses.filter((course) => course._id !== courseId);
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
  }

  function updateCourse(courseId, courseUpdates) {
    const course = db.courses.find((c) => c._id === courseId);
    if (!course) return null;
    Object.assign(course, courseUpdates);
    return course;
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
