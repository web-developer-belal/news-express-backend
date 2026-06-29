import { Request, Response } from "express";
import { NewsService } from "./news.service";

export const NewsController = {
  index: async (req: Request, res: Response) => {
    const news = await NewsService.index(req.query);

    return res.json({
      status: true,
      data: news,
    });
  },

  create: async (req: Request, res: Response) => {
    const news = await NewsService.create(req.body);

    return res.json({
      status: true,
      data: news,
    });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const news = await NewsService.update(id, req.body);

    return res.json({
      status: true,
      data: news,
    });
  },

  destroy: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const news = await NewsService.destroy(id);

    return res.json({
      status: true,
      data: news,
    });
  },
};