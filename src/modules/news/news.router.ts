import express from "express";
import { NewsController } from "./news.controller";
const router = express.Router();

router.post("/create", (req, res) => {
  NewsController.create(req,res)
});

export const newsRouter = router;
