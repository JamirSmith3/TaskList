import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByUser,
  updateTask,
} from "#db/queries/tasks";

const router = express.Router();

router.use(requireUser);

router.post(
  "/",
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { title, done } = req.body;
      const task = await createTask({
        title,
        done,
        user_id: req.user.id,
      });
      res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  },
);

router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasksByUser(req.user.id);
    res.json(tasks);
  } catch (e) {
    next(e);
  }
});

router.put(
  "/:id",
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const existing = await getTaskById(id);
      if (!existing) return res.status(404).send("Task not found.");
      if (existing.user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }
      const updated = await updateTask(id, req.body);
      res.json(updated);
    } catch (e) {
      next(e);
    }
  },
);

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getTaskById(id);
    if (!existing) return res.status(404).send("Task not found.");
    if (existing.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }
    await deleteTask(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

export default router;
