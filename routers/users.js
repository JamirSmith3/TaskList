import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser({ username, password });
      const token = createToken({ id: user.id, username: user.username });
      res.status(201).send(token);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid credentials.");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send("Invalid credentials.");

    const token = createToken({ id: user.id, username: user.username });
    res.send(token);
  },
);

export default router;
