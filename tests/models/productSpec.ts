import { PoolClient } from "pg";
import { ProductStore } from "../../src/models/product";
import client from "../../src/utils/database";

const store = new ProductStore();

describe("Product Model", () => {
  let productId: number, db: PoolClient;
  beforeAll(async () => {
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
  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("create method should add a product", async () => {
    const result = await store.create({
      name: "product",
      price: 1,
    });
    productId = result.id;
    // fetch product from actual database
    const product = (
      await db.query(`SELECT * FROM products WHERE id = $1`, [productId])
    ).rows[0];
    expect(product).toEqual({
      id: productId,
      name: result.name,
      price: result.price,
    });
  });
  it("index method should return a list of products", async () => {
    const result = await store.index();
    // fetch product from actual database
    const products = (await db.query(`SELECT * FROM products`)).rows;
    expect(products).toEqual(result);
  });
  it("show method should return a product", async () => {
    const result = await store.show(productId);
    // fetch product from actual database
    const product = (
      await db.query(`SELECT * FROM products WHERE id = $1`, [productId])
    ).rows[0];
    expect(product).toEqual(result);
  });
  it("delete method should delete a product", async () => {
    await store.delete(productId);
    const products = await store.index();
    products.forEach((product) => {
      expect(product.id).not.toBe(productId);
    });
  });

  afterAll(() => {
    db.release();
  });
});
