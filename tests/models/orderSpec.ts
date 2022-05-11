// import { OrderStore } from "../../src/models/order";
// import { ProductStore } from "../../src/models/product";
// import { UserStore } from "../../src/models/user";

// const store = new OrderStore();
// const userStore = new UserStore();
// const productStore = new ProductStore();

// xdescribe("Order Model", () => {
//   let orderId = 1;
//   let userId = 1;
//   let productId = 1;

//   beforeAll(async () => {
//     const user = await userStore.create({
//       firstName: "jane",
//       lastName: "Doe",
//       password: "password",
//     });
//     const product = await productStore.create({
//       name: "product",
//       price: 1,
//     });
//     productId = product.id;
//     userId = user.id;
//   });

//   it("should have an index method", () => {
//     expect(store.index).toBeDefined();
//   });
//   it("should have a show method", () => {
//     expect(store.show).toBeDefined();
//   });
//   it("should have a create method", () => {
//     expect(store.create).toBeDefined();
//   });
//   it("should have a addProduct method", () => {
//     expect(store.addProduct).toBeDefined();
//   });
//   it("should have a delete method", () => {
//     expect(store.delete).toBeDefined();
//   });
//   it("create method should add an order", async () => {
//     const result = await store.create({
//       userId: userId,
//       isActive: true,
//     });
//     orderId = result.id;
//     expect(result).toEqual({
//       id: orderId,
//       userId: userId,
//       isActive: true,
//     });
//   });
//   it("index method should return a list of orders", async () => {
//     const result = await store.index();
//     expect(result).toEqual([
//       {
//         id: orderId,
//         userId: userId,
//         isActive: true,
//       },
//     ]);
//   });
//   it("addProduct method should add a product to an order", async () => {
//     const result = await store.addProduct(orderId, productId, 1);
//     expect(result).toEqual({
//       orderId,
//       productId,
//       quantity: 1,
//     });
//   });

//   it("show method should return an order", async () => {
//     const result = await store.show(orderId);
//     expect(result).toEqual({
//       id: orderId,
//       userId: userId,
//       isActive: true,
//     });
//   });
//   it("delete method should delete an order", async () => {
//     await store.delete(orderId);
//     const result = await store.index();
//     expect(result).toEqual([]);
//   });
//   afterAll(async () => {
//     await userStore.delete(userId);
//     await productStore.delete(productId);
//   });
// });
