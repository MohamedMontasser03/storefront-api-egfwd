import { Application, Request, Response } from "express";
import requiresAuth from "../middlewares/requiresAuth";
import { ProductStore } from "../models/product";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.send(products);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const productID = req.params.id;
    const product = await store.show(Number(productID));
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const productRoutes = (app: Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", requiresAuth, create);
};

export default productRoutes;
