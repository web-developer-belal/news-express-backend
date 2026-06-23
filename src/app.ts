import express from "express";
import { CategoryRouter } from "./modules/category/category.router";

const app = express();
app.use(express.json())

app.use('/categories',CategoryRouter);

export default app;