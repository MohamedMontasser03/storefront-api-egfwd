import supertest from "supertest";
import { ProductStore } from "../../src/models/product";
import app from "../../src/server";

const request = supertest(app);
const store = new ProductStore();

describe("Product Handler", () => {
  const mockToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJmaXJzdF9uYW1lIjoiTW9oYW1lZCIsImxhc3RfbmFtZSI6Ik1vbnRhc3NlciIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCQ4UjlaWTRiQjE0YzQubG1HSWVjUWQudjlHVE1UaUF4Lkx5YUQ3dWpVTUFxWldZM1B5V0NhLiJ9LCJpYXQiOjE2NTIwMzQzMDN9.UyUTHfO5yYWHyn5S5FJs2asoYRcAS3zyZJjd052VvE0";

  let productId: number;

  it("should show a list of all products when GET /products", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(await store.index());
  });
  it("should create a new product when POST /products if authenticated", async () => {
    const response = await request
      .post("/products")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({
        name: "Product 1",
        price: 100,
      });
    productId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: productId,
      name: "Product 1",
      price: "100.00",
    });
  });
  it("should fail to create a new product when POST /products if not authenticated", async () => {
    const response = await request.post("/products").send({
      name: "Product 1",
      price: 100,
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual("Access denied, invalid token");
  });
  it("should show a product when GET /products/:id", async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(await store.show(productId));
  });
  it("should fail to show a product when GET /products/:id if product doesn't exist", async () => {
    const response = await request.get("/products/" + (productId + 1));
    expect(response.status).toBe(404);
    expect(response.body).toEqual("Product not found");
  });
});
