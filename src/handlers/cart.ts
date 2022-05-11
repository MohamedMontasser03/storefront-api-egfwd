import { Application, Request, Response } from "express";
import requiresAuth from "../middlewares/requiresAuth";
import { CartQuerys } from "../services/cart";

const store = new CartQuerys();

const showOrderProducts = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;
    const orders = await store.getOrdersOfUser(Number(userID));
    // get products of each order
    const products = await Promise.all(
      orders.map(async (order) => await store.getProductsInOrder(order.id))
    );
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json({ error: err });
  }
};

const cartRoutes = (app: Application) => {
  app.get("/users/:id/orders", requiresAuth, showOrderProducts);
};

export default cartRoutes;
