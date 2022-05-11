import { PoolClient } from "pg";
import { OrderStore } from "../../src/models/order";
import { ProductStore } from "../../src/models/product";
import { UserStore } from "../../src/models/user";
import client from "../../src/utils/database";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Order Model", () => {
  let orderId: number, productId: number, userId: number, db: PoolClient;

  beforeAll(async () => {
    const user = await userStore.create({
      firstName: "jane",
      lastName: "Doe",
      password: "password",
    });
    const product = await productStore.create({
      name: "product",
      price: 1,
    });
    productId = product.id;
    userId = user.id;
    db = await client.connect();
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });
  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });
  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });
  it("should have a addProduct method", () => {
    expect(store.addProduct).toBeDefined();
  });
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });
  it("create method should add an order", async () => {
    const result = await store.create({
      userId: userId,
      isActive: true,
    });
    orderId = result.id;
    // fetch order from actual database
    const order = (
      await db.query(`SELECT * FROM orders WHERE id = $1`, [orderId])
    ).rows[0];
    expect(order).toEqual({
      id: orderId,
      user_id: userId,
      is_active: true,
    });
  });
  it("index method should return a list of orders", async () => {
    const result = await store.index();
    // fetch order from actual database
    const orderList = (await db.query(`SELECT * FROM orders`)).rows;
    expect(result.length).toBe(orderList.length);
    expect(result[0].id).toBe(orderList[0].id);
    expect(result[0].userId).toBe(orderList[0].user_id);
    expect(result[0].isActive).toBe(orderList[0].is_active);
  });
  it("addProduct method should add a product to an order", async () => {
    const result = await store.addProduct(orderId, productId, 1);
    // fetch order-product from actual database
    const orderProducts = (
      await db.query(`SELECT * FROM orders_products WHERE order_id = $1`, [
        orderId,
      ])
    ).rows;
    expect(orderProducts.length).toBe(1);
    expect(orderProducts[0].order_id).toBe(orderId);
    expect(orderProducts[0].product_id).toBe(productId);
    expect(orderProducts[0].quantity).toBe(1);
  });

  it("show method should return an order", async () => {
    const result = await store.show(orderId);
    // fetch order from actual database
    const order = (
      await db.query(`SELECT * FROM orders WHERE id = $1`, [orderId])
    ).rows[0];
    expect(order).toEqual({
      id: orderId,
      user_id: userId,
      is_active: true,
    });
  });
  it("delete method should delete an order", async () => {
    await store.delete(orderId);
    const result = await store.index();
    result.forEach((order) => {
      expect(order.id).not.toBe(orderId);
    });
  });
  afterAll(() => {
    db.release();
  });
});
