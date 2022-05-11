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
  let mockToken: string;
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
    mockToken = (
      await request.post("/users/login").send({
        id: user.id,
        password: "123456",
      })
    ).body.token;
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
