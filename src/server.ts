import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cartRoutes from "./handlers/cart";
import productRoutes from "./handlers/product";
import userRoutes from "./handlers/user";

const app: express.Application = express();
const port = 3000;

app.use(express.json());

userRoutes(app);
productRoutes(app);
cartRoutes(app);

app.listen(port, () => console.log(`starting app on port ${port}`));
