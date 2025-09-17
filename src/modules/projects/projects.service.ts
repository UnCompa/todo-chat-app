import { prisma } from '@lib/prisma.js';

export class ProjectService {
  static async addNewProject({ name, description, organizationId }: { name: string, description: string, organizationId: string }) {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        organizationId,
      },
    });
    await this.seedProjectData(project.id)
    return project;
  }

  protected static async seedProjectData(projectId: string) {
    const columsData = [
      {
        name: "Pendiente",
        order: 1,
        projectId: projectId,
      },
      {
        name: "En progreso",
        order: 2,
        projectId: projectId,

      },
      {
        name: "Completado",
        order: 3,
        projectId: projectId,
      }
    ]

    await prisma.column.createMany({
      data: columsData
    })

    const firstColumn = await prisma.column.findFirst({
      where: { projectId: projectId, order: 1 },
      select: {
        id: true
      }
    })

    const newTasks = await prisma.task.create({
      data: {
        title: "New Task Title",
        description: "Task description",
        status: "pending",
        order: 1,
        projectId: projectId,
        columnId: firstColumn?.id || '',
        dueDate: new Date(),
        priority: "Alta",
      }
    })

    const labels = [
      {
        name: "Urgente",
        color: "#FF3B30", // rojo
        projectId: projectId,
      },
      {
        name: "Alta prioridad",
        color: "#FF9500", // naranja
        projectId: projectId,
      },
      {
        name: "Media prioridad",
        color: "#FFCC00", // amarillo
        projectId: projectId,
      },
      {
        name: "Baja prioridad",
        color: "#34C759", // verde
        projectId: projectId,
      },
      {
        name: "Bloqueado",
        color: "#AF52DE", // morado
        projectId: projectId,
      },
      {
        name: "En revisión",
        color: "#5AC8FA", // celeste
        projectId: projectId,
      },
      {
        name: "Posponer",
        color: "#8E8E93", // gris
        projectId: projectId,
      },
      {
        name: "Para mañana",
        color: "#007AFF", // azul
        projectId: projectId,
      },
      {
        name: "Reunión",
        color: "#FFD60A", // amarillo brillante
        projectId: projectId,
      },
      {
        name: "Automatizar",
        color: "#32D74B", // verde claro
        projectId: projectId,
      },
    ];
    

    await prisma.label.createMany({ data: labels });
    
  }
}