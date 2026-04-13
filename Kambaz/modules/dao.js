import { v4 as uuidv4 } from "uuid";
import model from "../courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    if (!course) return [];
    return course.modules || [];
  }

  async function createModule(courseId, module) {
    const newModule = {
      ...module,
      _id: uuidv4(),
      lessons: module.lessons || [],
    };
    delete newModule.course;
    await model.updateOne({ _id: courseId }, { $push: { modules: newModule } });
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    return model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    if (!course) return null;
    const mod = course.modules.find((m) => String(m._id) === String(moduleId));
    if (!mod) return null;
    const { _id: _ignored, ...rest } = moduleUpdates;
    void _ignored;
    Object.assign(mod, rest);
    await course.save();
    return mod;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
