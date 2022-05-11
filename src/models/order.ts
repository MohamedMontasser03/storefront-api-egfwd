import client from "../utils/database";

export type Order = {
  id: number;
  userId: number;
  isActive: boolean;
};

const fromatOrder = (order: {
  id: number;
  user_id: number;
  is_active: boolean;
}): Order => ({
  id: order.id,
  userId: order.user_id,
  isActive: order.is_active,
});

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const res = await conn.query(sql);
      conn.release();
      return res.rows.map((order) => fromatOrder(order));
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
      return fromatOrder(res.rows[0]);
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
      return fromatOrder(res.rows[0]);
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    }
  }
  async addProduct(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<{
    orderId: number;
    productId: number;
    quantity: number;
  }> {
    try {
      const sql =
        "INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
      const conn = await client.connect();
      const res = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return {
        orderId: res.rows[0].order_id,
        productId: res.rows[0].product_id,
        quantity: res.rows[0].quantity,
      };
    } catch (err) {
      throw new Error(`Could not add product to order. Error: ${err}`);
    }
  }
  async delete(id: number): Promise<void> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)";
      const conn = await client.connect();
      const res = await conn.query(sql, [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
