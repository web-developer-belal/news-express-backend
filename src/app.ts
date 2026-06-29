import express from "express";
import { CategoryRouter } from "./modules/category/category.router";
import { NewsRouter } from "./modules/news/news.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

app.all("/api/auth/{*path}", toNodeHandler(auth));

app.use(express.json())

app.use('/categories',CategoryRouter);
app.use('/news',NewsRouter);

export default app;