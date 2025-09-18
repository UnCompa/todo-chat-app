import { prisma } from '@lib/prisma.js';
import { NextFunction, Request, Response } from 'express';
export const requireOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.params.organizationId || req.session?.activeOrganizationId;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    // Verificar que el usuario pertenece a la organización
    const member = await prisma.member.findFirst({
      where: {
        userId: req.user!.id,
        organizationId: organizationId,
      },
      include: {
        organization: true,
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Access denied to organization' });
    }

    // Agregar organización y rol al request
    req.organization = member.organization;
    req.userRole = member.role;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Organization verification failed: ' + (error as Error).message });
  }
};
