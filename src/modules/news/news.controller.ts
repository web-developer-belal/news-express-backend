import { Request, Response } from "express";
import { NewsService } from "./news.service";

const create = async (req: Request, res: Response) => {
  try {
    // console.log("=== DEBUGGING ===");
    // console.log("Headers:", req.headers);
    // console.log("Content-Type:", req.headers['content-type']);
    // console.log("Body:", req.body);
    // console.log("Body type:", typeof req.body);
    // console.log("Body keys:", req.body ? Object.keys(req.body) : 'empty');
    // ✅ Extract data from request body
    const {
      title,
      content,
      status,
      categoryId,
      subCategoryId,
      thumbnail,
      galleryImages,
      excerpt,
      metaTitle,
      metaDescription,
      metaKeywords,
      seo
    } = req.body;

    // ✅ Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    // ✅ Pass data to service (not res!)
    const result = await NewsService.create({
      title,
      content,
      status: status || 'draft',
      categoryId: categoryId || null,
      subCategoryId: subCategoryId || null,
      thumbnail: thumbnail || null,
      galleryImages: galleryImages || [],
      excerpt: excerpt || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      seo: seo || {},
    });

    // ✅ Send success response
    return res.status(201).json({
      success: true,
      data: result,
      message: "News created successfully"
    });

  } catch (error) {
    console.error("Error creating news:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create news",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const NewsController = {
  create
};