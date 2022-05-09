import { Application, Request, Response } from "express";
import requiresAuth from "../middlewares/requiresAuth";
import { ProductStore } from "../models/product";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.send(products);
};

const show = async (req: Request, res: Response) => {
  const productID = req.params.id;
  const product = await store.show(Number(productID));
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const product = {
      name: req.body.name,
      price: req.body.price,
    };
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err: any) {
    res.status(400);
    res.json({ error: err.message });
  }
};

const productRoutes = (app: Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", requiresAuth, create);
};

export default productRoutes;
