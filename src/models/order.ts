import client from "../utils/database";

export type Order = {
  id: number;
  userId: number;
  isActive: boolean;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const res = await conn.query(sql);
      conn.release();
      return res.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }
  async show(id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const conn = await client.connect();
      const res = await conn.query(sql, [id]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }
  async create(p: Omit<Order, "id">): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, is_active) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const res = await conn.query(sql, [p.userId, p.isActive]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    }
  }
  async addProduct(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const conn = await client.connect();
      const res = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return res.rows[0];
    } catch (err) {
      throw new Error(`Could not add product to order. Error: ${err}`);
    }
  }
}
