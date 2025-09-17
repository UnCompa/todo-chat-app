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

  static async getAllTasksByProject(
    projectId: string,
    {
      page = 1,
      limit = 10,
      status,
      label,
      assignedTo,
    }: {
      page?: number;
      limit?: number;
      status?: string;
      label?: string;
      assignedTo?: string;
    } = {},
  ) {
    const where: any = {
      projectId,
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }

    if (label) {
      where.labels = {
        some: {
          label: {
            name: label,
          },
        },
      };
    }

    if (assignedTo) {
      where.assignees = {
        some: {
          userId: assignedTo,
        },
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        labels: {
          include: { label: true },
        },
        assignees: {
          include: { user: true },
        },
      },
    });

    const total = await prisma.task.count({ where });

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  static async createTask({
    title,
    description,
    status = 'pending',
    priority,
    dueDate,
    projectId,
    columnId,
    assignedTo = [],
    labelIds = [],
  }: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    projectId: string;
    columnId: string;
    assignedTo?: string[]; // user IDs
    labelIds?: string[]; // label IDs
  }) {
    // 1. Obtener el último orden de tareas en esta columna
    const lastTask = await prisma.task.findFirst({
      where: { columnId, isDeleted: false },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (lastTask?.order ?? 0) + 1;

    // 2. Crear la tarea con relaciones
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        columnId,
        order: nextOrder,
        assignees: {
          create: assignedTo.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
        labels: {
          create: labelIds.map((labelId) => ({
            label: { connect: { id: labelId } },
          })),
        },
      },
      include: {
        assignees: { include: { user: true } },
        labels: { include: { label: true } },
      },
    });

    return newTask;
  }

  static async getTask(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignees: {
          where: { isDeleted: false },
          include: {
            user: true,
          },
        },
        labels: {
          where: { isDeleted: false },
          include: {
            label: true,
          },
        },
        comments: {
          where: { isDeleted: false },
          include: {
            user: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: {
          where: { isDeleted: false },
          include: {
            uploadedBy: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        column: true,
      },
    });

    if (!task || task.isDeleted) {
      return null;
    }

    // Mapear para simplificar la estructura
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      order: task.order,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      column: {
        id: task.column.id,
        name: task.column.name,
      },
      assignees: task.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name,
        email: a.user.email,
        avatar: a.user.image,
      })),
      labels: task.labels.map((l) => ({
        id: l.label.id,
        name: l.label.name,
        color: l.label.color,
      })),
      comments: task.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          id: c.user.id,
          name: c.user.name,
          email: c.user.email,
        },
      })),
      attachments: task.attachments.map((a) => ({
        id: a.id,
        url: a.url,
        createdAt: a.createdAt,
        uploadedBy: {
          id: a.uploadedBy.id,
          name: a.uploadedBy.name,
          email: a.uploadedBy.email,
        },
      })),
    };
  }
  static async updateTask(
    id: string,
    {
      title,
      description,
      status,
      priority,
      dueDate,
      columnId,
      assignedTo,
      labelIds,
    }: {
      title?: string;
      description?: string | null;
      status?: string;
      priority?: string | null;
      dueDate?: Date | null;
      columnId?: string;
      assignedTo?: string[];
      labelIds?: string[];
    },
  ) {
    // 1. Verificar si la tarea existe y no está eliminada
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: { id: true, isDeleted: true },
    });

    if (!existingTask || existingTask.isDeleted) {
      throw new Error('Task not found or has been deleted');
    }

    // 2. Actualizar campos básicos
    await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(columnId !== undefined && { columnId }),
      },
    });

    // 3. Reemplazar asignados si se envían
    if (assignedTo) {
      // Eliminar relaciones actuales
      await prisma.taskAssignee.deleteMany({
        where: {
          taskId: id,
        },
      });

      // Crear nuevas relaciones
      await prisma.taskAssignee.createMany({
        data: assignedTo.map((userId) => ({
          taskId: id,
          userId,
        })),
        skipDuplicates: true,
      });
    }

    // 4. Reemplazar etiquetas si se envían
    if (labelIds) {
      await prisma.taskLabel.deleteMany({
        where: {
          taskId: id,
        },
      });

      await prisma.taskLabel.createMany({
        data: labelIds.map((labelId) => ({
          taskId: id,
          labelId,
        })),
        skipDuplicates: true,
      });
    }

    // 5. Devolver tarea con relaciones (puedes reutilizar getTask)
    return this.getTask(id);
  }

  static async deleteTask(id: string) {
    await prisma.task.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }
  static async restoredTask(id: string) {
    await prisma.task.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
  }

  static async moveTask(id: string, columnId: string) {
    return await prisma.task.update({
      where: {
        id,
        isDeleted: false,
      },
      data: {
        columnId,
      },
    });
  }

  static async createComment(content: string, userId: string, taskId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId, isDeleted: false } });
    if (!task) {
      throw CreateError.notFound('Task not found');
    }

    await prisma.comment.create({
      data: {
        content,
        userId,
        taskId,
      },
    });
  }
  static async deleteComment(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id: id, isDeleted: false } });
    if (!comment) {
      throw CreateError.notFound('Comment not found');
    }

    await prisma.comment.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}
