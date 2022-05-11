import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import requiresAuth from "../middlewares/requiresAuth";
import { UserStore } from "../models/user";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.send(users);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const user = await store.show(Number(userID));
    res.json(user);
  } catch (err) {
    res.status(404);
    res.json("User not found");
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string
    );
    res.status(201).json({ token });
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const u = await store.authenticate(req.body.id, req.body.password);
    if (!u) return res.status(401).json("Access denied, invalid credentials");
    const token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
    res.json({ token });
  } catch (err) {
    res.status(401);
    res.json({ error: err });
  }
};

const userRoutes = (app: Application) => {
  app.get("/users", requiresAuth, index);
  app.get("/users/:id", requiresAuth, show);
  app.post("/users/login", authenticate);
  app.post("/users", create);
};

export default userRoutes;
