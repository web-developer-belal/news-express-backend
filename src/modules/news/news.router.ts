import { Router } from "express";
import { NewsController } from "./news.controller";

const router = Router();

router.get("/", NewsController.index);
router.post("/store", NewsController.create);
router.put("/update/:id", NewsController.update);
router.delete("/delete/:id", NewsController.destroy);

export const NewsRouter= router;