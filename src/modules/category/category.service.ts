import { prisma } from "../../lib/prisma";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

export default {
  index: async () => {
    return prisma.category.findMany({});
  },

  create: async (payload: { name: string; isActive: boolean }) => {
    const slug = generateSlug(payload.name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    return prisma.category.create({
      data: {
        ...payload,
        slug,
      },
    });
  },

  update: async (id: any, payload: { name: string; isActive: boolean }) => {
    const slug = generateSlug(payload.name);
    const categoryId: number = parseInt(id);
    await prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
    });

    return prisma.category.update({
      where: { id: categoryId },
      data: {
        ...payload,
        slug,
      },
    });
  },
  
  destroy: async (id: any) => {
    const categoryId: number = parseInt(id);
    await prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
    });

    return prisma.category.delete({
      where: { id: categoryId },
    });
  },
};
