import { helperFunction } from "../../lib/helper";
import { pagination } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../lib/apiResponse";

type NewsPayload = {
  categoryId?: number;
  title: string;
  content: string;
};

type Filter = {
  search?: string;
  categoryId?: number | string;
  subcategoryId?: number | string;
  page?: number | string;
  limit?: number | string;
};

export const NewsService = {
  index: async (params: Filter) => {
    try {
      const filters: any = {};

      if (params.search) {
        filters.title = {
          contains: params.search,
          mode: "insensitive",
        };
      }

      if (params.categoryId) {
        filters.categoryId = Number(params.categoryId);
      }

      if (params.subcategoryId) {
        filters.subcategoryId = Number(params.subcategoryId);
      }

      const { page, limit, skip } = pagination.paginate(
        params.page,
        params.limit
      );

      const [news, total] = await Promise.all([
        prisma.news.findMany({
          where: filters,
          include: {
            category: true,
          },
          take: limit,
          skip,
          orderBy: {
            id: "desc",
          },
        }),
        prisma.news.count({
          where: filters,
        }),
      ]);

      const metadata = pagination.meta(total, page, limit);

      return ApiResponse.success(
        news,
        "News fetched successfully",
        metadata
      );
    } catch (error) {
      return ApiResponse.failure(error, "Failed to fetch news");
    }
  },

  create: async (payload: NewsPayload) => {
    try {
      const slug = helperFunction.generateSlug(payload.title);

      const news = await prisma.news.create({
        data: {
          categoryId: payload.categoryId,
          title: payload.title,
          content: payload.content,
          slug,
        },
        include: {
          category: true,
        },
      });

      return ApiResponse.success(
        news,
        "News created successfully"
      );
    } catch (error) {
      return ApiResponse.failure(error, "Failed to create news");
    }
  },

  update: async (
    id: number,
    payload: Partial<NewsPayload>
  ) => {
    try {
      const slug = payload.title
        ? helperFunction.generateSlug(payload.title)
        : undefined;

      const news = await prisma.news.update({
        where: { id },
        data: {
          ...payload,
          ...(slug && { slug }),
        },
        include: {
          category: true,
        },
      });

      return ApiResponse.success(
        news,
        "News updated successfully"
      );
    } catch (error) {
      return ApiResponse.failure(error, "Failed to update news");
    }
  },

  show: async (id: number) => {
    try {
      const news = await prisma.news.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!news) {
        return ApiResponse.failure(
          null,
          "News not found"
        );
      }

      return ApiResponse.success(
        news,
        "News fetched successfully"
      );
    } catch (error) {
      return ApiResponse.failure(error, "Failed to fetch news");
    }
  },

  destroy: async (id: number) => {
    try {
      const news = await prisma.news.delete({
        where: { id },
      });

      return ApiResponse.success(
        news,
        "News deleted successfully"
      );
    } catch (error) {
      return ApiResponse.failure(error, "Failed to delete news");
    }
  },
};