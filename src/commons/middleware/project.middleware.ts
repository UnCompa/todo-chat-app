import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";
import { prisma } from '@lib/prisma.js';

export const requireProjectAccess = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID required" });
    }

    // Verificar que el proyecto pertenece a la organización del usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId: req.organization?.id,
      },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found or access denied" });
    }

    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Project access verification failed" });
  }
};