import { prisma } from '@lib/prisma.js';
import { CreateError } from 'src/commons/utils/exceptions.js';

export class ProjectService {
  static async addNewProject({
    name,
    description,
    organizationId,
  }: {
    name: string;
    description: string;
    organizationId: string;
  }) {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        organizationId,
      },
    });
    await this.seedProjectData(project.id);
    return project;
  }

  static async getProjects({ organizationId }: { organizationId: string }) {
    return await prisma.project.findMany({
      where: { organizationId, isDeleted: false },
      omit: {
        isDeleted: true,
      },
    });
  }
  static async update(id: string, { name, description }: { name: string; description: string }) {
    const findProject = await prisma.project.findUnique({ where: { id } });
    if (!findProject) {
      throw CreateError.badRequest('Project not exists.');
    }

    const newProject = await prisma.project.update({
      where: { id },
      data: { name, description },
      omit: {
        isDeleted: true,
      },
    });
    return newProject;
  }
  static async getProjectDetails({ id }: { id: string }) {
    const data = await prisma.project.findUnique({
      where: { id, isDeleted: false },
      include: {
        columns: {
          where: {
            isDeleted: false,
          },
          select: {
            id: true,
            name: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        organization: {
          include: {
            members: {
              select: {
                role: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!data) {
      throw CreateError.badRequest('Project not exists.');
    }
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      organizationId: data.organizationId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      columns: data.columns,
      members: data.organization.members.map((member) => ({
        ...member.user,
        role: member.role,
      })),
    };
  }

  static async deleteProject(id: string) {
    const findProject = await prisma.project.findUnique({ where: { id } });
    if (findProject) {
      await prisma.project.update({ where: { id }, data: { isDeleted: true } });
    } else {
      throw CreateError.badRequest('Project not exists.');
    }
  }
  static async undoProject(id: string) {
    const findProject = await prisma.project.findUnique({ where: { id } });
    if (findProject) {
      await prisma.project.update({ where: { id }, data: { isDeleted: false } });
    } else {
      throw CreateError.badRequest('Project not exists.');
    }
  }

  protected static async seedProjectData(projectId: string) {
    const columsData = [
      {
        name: 'Pendiente',
        order: 1,
        projectId: projectId,
      },
      {
        name: 'En progreso',
        order: 2,
        projectId: projectId,
      },
      {
        name: 'Completado',
        order: 3,
        projectId: projectId,
      },
    ];

    await prisma.column.createMany({
      data: columsData,
    });

    const firstColumn = await prisma.column.findFirst({
      where: { projectId: projectId, order: 1 },
      select: {
        id: true,
      },
    });

    await prisma.task.create({
      data: {
        title: 'New Task Title',
        description: 'Task description',
        status: 'pending',
        order: 1,
        projectId: projectId,
        columnId: firstColumn?.id || '',
        dueDate: new Date(),
        priority: 'Alta',
      },
    });

    const labels = [
      {
        name: 'Urgente',
        color: '#FF3B30', // rojo
        projectId: projectId,
      },
      {
        name: 'Alta prioridad',
        color: '#FF9500', // naranja
        projectId: projectId,
      },
      {
        name: 'Media prioridad',
        color: '#FFCC00', // amarillo
        projectId: projectId,
      },
      {
        name: 'Baja prioridad',
        color: '#34C759', // verde
        projectId: projectId,
      },
      {
        name: 'Bloqueado',
        color: '#AF52DE', // morado
        projectId: projectId,
      },
      {
        name: 'En revisión',
        color: '#5AC8FA', // celeste
        projectId: projectId,
      },
      {
        name: 'Posponer',
        color: '#8E8E93', // gris
        projectId: projectId,
      },
      {
        name: 'Para mañana',
        color: '#007AFF', // azul
        projectId: projectId,
      },
      {
        name: 'Reunión',
        color: '#FFD60A', // amarillo brillante
        projectId: projectId,
      },
      {
        name: 'Automatizar',
        color: '#32D74B', // verde claro
        projectId: projectId,
      },
    ];

    await prisma.label.createMany({ data: labels });
  }
}
