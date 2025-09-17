import { prisma } from '@lib/prisma.js';
export class LabelService {
  static async createLabel(name: string, color: string, projectId: string) {
    return await prisma.label.create({
      data: {
        name,
        color,
        projectId,
      },
    });
  }

  static async getAll(projectId: string) {
    return await prisma.label.findMany({
      where: {
        projectId: projectId,
        isDeleted: false,
      },
      omit: {
        isDeleted: true,
      },
    });
  }

  static async updateLabel(id: string, { name, color, projectId }: { name: string; color: string; projectId: string }) {
    return await prisma.label.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        name,
        color,
        projectId,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.label.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }

  static async undo(id: string) {
    return await prisma.label.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
  }
}
