import { Order } from "../models/order";
import { Product } from "../models/product";
import client from "../utils/database";

export class CartQuerys {
  async getProductsInOrder(orderId: number): Promise<Product[]> {
    try {
      const sql =
        "SELECT name, op.quantity FROM products p INNER JOIN orders_products op ON op.product_id = p.id WHERE op.order_id = $1";
      const conn = await client.connect();
      const res = await conn.query(sql, [orderId]);
      conn.release();
      return res.rows;
    } catch (err) {
      throw new Error(`Could not get products in order. Error: ${err}`);
    }
  }
  async getOrdersOfUser(userId: number): Promise<Order[]> {
    try {
      const sql = "SELECT * FROM orders WHERE user_id = $1";
      const conn = await client.connect();
      const res = await conn.query(sql, [userId]);
      conn.release();
      return res.rows;
    } catch (err) {
      throw new Error(`Could not get order of user. Error: ${err}`);
    }
  }
}
