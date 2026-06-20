import express from "express";
import { newsRouter } from "./modules/news/news.router";

const app = express();
app.use(express.json())


app.use('/news',newsRouter)


export default app;