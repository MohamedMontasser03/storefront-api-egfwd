import supertest from "supertest";
import { OrderStore } from "../../src/models/order";
import { ProductStore } from "../../src/models/product";
import { UserStore } from "../../src/models/user";
import app from "../../src/server";
import { CartQuerys } from "../../src/services/cart";

const request = supertest(app);
const store = new CartQuerys();
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe("Cart Handler", () => {
  const mockToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJmaXJzdF9uYW1lIjoiTW9oYW1lZCIsImxhc3RfbmFtZSI6Ik1vbnRhc3NlciIsInBhc3N3b3JkX2RpZ2VzdCI6IiQyYiQxMCQ4UjlaWTRiQjE0YzQubG1HSWVjUWQudjlHVE1UaUF4Lkx5YUQ3dWpVTUFxWldZM1B5V0NhLiJ9LCJpYXQiOjE2NTIwMzQzMDN9.UyUTHfO5yYWHyn5S5FJs2asoYRcAS3zyZJjd052VvE0";

  let userId: number;
  let productId: number;
  let orderId: number;
  let orderProductId: number;

  beforeAll(async () => {
    const user = await userStore.create({
      firstName: "John",
      lastName: "Doe",
      password: "123456",
    });
    userId = user.id;
    const product = await productStore.create({
      name: "Product 1",
      price: 100,
    });
    productId = product.id;
    const order = await orderStore.create({
      userId,
      isActive: true,
    });
    orderId = order.id;
    const orderProduct = await orderStore.addProduct(orderId, productId, 1);
    orderProductId = orderProduct.id;
  });

  it("should return all orders of a user when authenticated", async () => {
    const response = await request
      .get(`/users/${userId}/orders`)
      .set("Authorization", `Bearer ${mockToken}`);
    expect(response.status).toBe(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].length).toBe(1);
    expect(response.body[0][0].name).toBe("Product 1");
    expect(response.body[0][0].quantity).toBe(1);
  });

  it("should return all orders of a user when not authenticated", async () => {
    const response = await request.get(`/users/${userId}/orders`);
    expect(response.status).toBe(401);
    expect(response.body).toBe("Access denied, invalid token");
  });
});
