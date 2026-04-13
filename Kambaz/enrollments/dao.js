import model from "./model.js";

export default function EnrollmentsDao(db) {
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments
      .map((e) => e.course)
      .filter((c) => c != null);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments
      .map((e) => e.user)
      .filter((u) => u != null);
  }

  async function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
  }

  async function enrollUserInCourse(userId, courseId) {
    const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) return existing;
    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
  }

  async function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  async function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    findEnrollmentsForUser,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
