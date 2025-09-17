import { prisma } from '@lib/prisma.js';
import { CreateError } from 'src/commons/utils/exceptions.js';
export class HelperService {
  static async createNewAnswer(userId: string, answer: string, question: string) {
    const feedbackExists = await prisma.feedback.findFirst({
      where: { userId },
    });
    if (feedbackExists) {
      await prisma.feedbackAnswer.create({
        data: { answer, question, feedbackId: feedbackExists.id },
      });
    } else {
      const newFeedback = await prisma.feedback.create({
        data: { userId },
        select: {
          id: true,
        },
      });
      await prisma.feedbackAnswer.create({
        data: { answer, question, feedbackId: newFeedback.id },
      });
    }
  }
  static async addColumn({ projectId, name }: { name: string; projectId: string }) {
    const lastColumn = await prisma.column.findFirst({
      where: { projectId, isDeleted: false },
      select: { order: true },
      orderBy: { order: 'desc' },
    });

    if (!lastColumn) {
      throw CreateError.notFound('No project found with columns');
    }

    const lastOrder = lastColumn?.order ?? -1;

    await prisma.column.create({
      data: {
        projectId,
        name,
        order: lastOrder + 1,
      },
    });
  }

  static async updateColumn(id: string, name: string) {
    const columnExists = await prisma.column.findUnique({ where: { id } });
    if (!columnExists) {
      throw CreateError.notFound('Column not found');
    }
    return await prisma.column.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  static async deleteColumn(id: string) {
    const column = await prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw CreateError.notFound('Column not found');
    }

    return await prisma.$transaction(async (tx) => {
      // Eliminar la columna
      await tx.column.delete({ where: { id } });

      // Reordenar las columnas restantes
      await tx.column.updateMany({
        where: {
          projectId: column.projectId,
          order: { gt: column.order }, // todas las que estaban después
        },
        data: {
          order: { decrement: 1 },
        },
      });
    });
  }

  static async moveColumn(id: string, newOrder: number) {
    const column = await prisma.column.findUnique({ where: { id } });
    if (!column) {
      throw CreateError.notFound('Column not found');
    }

    return await prisma.$transaction(async (tx) => {
      const oldOrder = column.order;

      if (newOrder > oldOrder) {
        // Mover hacia adelante: shift las de en medio hacia atrás
        await tx.column.updateMany({
          where: {
            projectId: column.projectId,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      } else if (newOrder < oldOrder) {
        // Mover hacia atrás: shift las de en medio hacia adelante
        await tx.column.updateMany({
          where: {
            projectId: column.projectId,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      // Actualizar la columna movida
      return await tx.column.update({
        where: { id },
        data: { order: newOrder },
      });
    });
  }
}
