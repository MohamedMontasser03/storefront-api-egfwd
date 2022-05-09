import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import requiresAuth from "../middlewares/requiresAuth";
import { UserStore } from "../models/user";

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.send(users);
};

const show = async (req: Request, res: Response) => {
  const userID = req.params.id;
  const user = await store.show(Number(userID));
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err: any) {
    res.status(400);
    res.json({ error: err.message });
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const u = await store.authenticate(req.body.id, req.body.password);
    var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (error) {
    res.status(401);
    res.json({ error });
  }
};

const userRoutes = (app: Application) => {
  app.get("/users", requiresAuth, index);
  app.get("/users/:id", requiresAuth, show);
  app.post("/users/login", authenticate);
  app.post("/users", requiresAuth, create);
};

export default userRoutes;
