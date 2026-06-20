// modules/news/news.service.ts
import { News, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// ─── Slug Generation Function ───
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ─── Generate Unique Slug ───
const generateUniqueSlug = async (title: string): Promise<string> => {
  let slug = generateSlug(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (true) {
    const existing = await prisma.news.findUnique({
      where: { slug: uniqueSlug }
    });

    if (!existing) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

// ✅ Add publishedAt to Omit list
type CreateNewsInput = Omit<News, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'views' | 'publishedAt'> & {
  galleryImages?: Prisma.JsonValue;
  seo?: Prisma.JsonValue;
};

// ─── Create News with Auto-Generated Slug ───
const create = async (data: CreateNewsInput) => {
  try {
    const slug = await generateUniqueSlug(data.title);

    const result = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        slug: slug,
        excerpt: data.excerpt || null,
        status: data.status || 'draft',
        categoryId: data.categoryId || null,
        subCategoryId: data.subCategoryId || null,
        thumbnail: data.thumbnail || null,
        galleryImages: data.galleryImages || [],
        views: 0,
        // ✅ Auto-set publishedAt based on status
        publishedAt: data.status === 'published' ? new Date() : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        metaKeywords: data.metaKeywords || null,
        seo: data.seo || {},
      }
    });

    return result;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

// ─── Get All News ───
const getAll = async () => {
  return prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

// ─── Get News by ID ───
const getById = async (id: number) => {
  return prisma.news.findUnique({
    where: { id }
  });
};

// ─── Get News by Slug ───
const getBySlug = async (slug: string) => {
  return prisma.news.findUnique({
    where: { slug }
  });
};

// ─── Update News ───
type UpdateNewsInput = Partial<Omit<News, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'views' | 'publishedAt'>>;

const update = async (id: number, data: UpdateNewsInput) => {
  try {
    let slug: string | undefined;
    if (data.title) {
      slug = await generateUniqueSlug(data.title);
    }

    // Auto-update publishedAt if status changes
    const updateData: any = {
      ...data,
      ...(slug && { slug }),
    };

    if (data.status === 'published') {
      updateData.publishedAt = new Date();
    } else if (data.status === 'draft' || data.status === 'archived') {
      updateData.publishedAt = null;
    }

    const result = await prisma.news.update({
      where: { id },
      data: updateData
    });

    return result;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

// ─── Delete News ───
const deleteNews = async (id: number) => {
  try {
    const result = await prisma.news.delete({
      where: { id }
    });
    return result;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

// ─── Check if Slug Exists ───
const slugExists = async (slug: string): Promise<boolean> => {
  const news = await prisma.news.findUnique({
    where: { slug }
  });
  return !!news;
};

export const NewsService = {
  create,
  getAll,
  getById,
  getBySlug,
  update,
  delete: deleteNews,
  generateSlug,
  generateUniqueSlug,
  slugExists
};