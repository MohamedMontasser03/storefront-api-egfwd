import { PoolClient } from "pg";
import { OrderStore } from "../../src/models/order";
import { ProductStore } from "../../src/models/product";
import { UserStore } from "../../src/models/user";
import { CartQuerys } from "../../src/services/cart";
import client from "../../src/utils/database";

const store = new CartQuerys();
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe("Cart Querys", () => {
  let userId: number, orderId: number, db: PoolClient;

  beforeAll(async () => {
    db = await client.connect();
    const user = await userStore.create({
      firstName: "jane",
      lastName: "Doe",
      password: "password",
    });
    userId = user.id;
    const product = await productStore.create({ name: "product", price: 1 });
    const order = await orderStore.create({
      userId: userId,
      isActive: true,
    });
    orderId = order.id;
    await orderStore.addProduct(order.id, product.id, 1);
  });

  it("should have a getProductsInOrder method", () => {
    expect(store.getProductsInOrder).toBeDefined();
  });
  it("should have a getOrdersOfUser method", () => {
    expect(store.getOrdersOfUser).toBeDefined();
  });
  it("getProductsInOrder should return a list of products", async () => {
    const products = await store.getProductsInOrder(orderId);
    // get products from actual database
    const productsInDb = (
      await db.query(
        `SELECT name, op.quantity FROM products p INNER JOIN orders_products op ON op.product_id = p.id WHERE op.order_id = $1`,
        [orderId]
      )
    ).rows;
    expect(products).toEqual(productsInDb);
  });
  it("should return all orders of a user", async () => {
    const orders = await store.getOrdersOfUser(userId);
    // get orders from actual database
    const actualOrders = (
      await db.query(`SELECT * FROM orders WHERE user_id = $1`, [userId])
    ).rows;
    expect(orders).toEqual(actualOrders);
  });

  afterAll(async () => {
    db.release();
  });
});
