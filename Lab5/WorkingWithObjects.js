const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: "M101",
  name: "Introduction to Node",
  description: "Basic Node.js concepts",
  course: "CS5610",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };

  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment", getAssignment);

  const setAssignmentTitle = (req, res) => {
    const { newTitle } = req.params;
    assignment.title = newTitle;
    res.json(assignment);
  };
  app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

  // Assignment routes (updates)
  app.get("/lab5/assignment/score/:newScore", (req, res) => {
    assignment.score = parseInt(req.params.newScore);
    res.json(assignment);
  });
  app.get("/lab5/assignment/completed/:completed", (req, res) => {
    assignment.completed = req.params.completed === "true";
    res.json(assignment);
  });

  // Module routes
  app.get("/lab5/module", (req, res) => res.json(module));
  app.get("/lab5/module/name", (req, res) => res.json(module.name));
  app.get("/lab5/module/name/:newName", (req, res) => {
    module.name = req.params.newName;
    res.json(module);
  });
  app.get("/lab5/module/description/:newDescription", (req, res) => {
    module.description = req.params.newDescription;
    res.json(module);
  });
}
