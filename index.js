import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/database/index.js";
import UserRoutes from "./Kambaz/users/routes.js";
import CourseRoutes from "./Kambaz/courses/routes.js";
import ModulesRoutes from "./Kambaz/modules/routes.js";
import AssignmentsRoutes from "./Kambaz/assignments/routes.js";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
