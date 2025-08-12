import express from "express";
import usersRouter from "#routers/users";
import tasksRouter from "#routers/tasks";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();
export default app;

app.use(express.json());

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
