import { prisma } from '@lib/prisma.js';
import { CreateError } from 'src/commons/utils/exceptions.js';

export class TasksService {
  static async getAllTasks() {
    try {
      return await prisma.task.findMany({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw CreateError.internal((error as Error).message);
    }
  }
}
