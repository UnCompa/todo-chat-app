import { auth } from '@auth/auth.js';
import { type Session } from 'better-auth';
import { NextFunction, Request, Response } from 'express';

export interface SessionWithOrganization extends Session {
  activeOrganizationId?: string | null | undefined;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Better Auth extrae el token de cookies/headers automáticamente
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Agregar user y session al request
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication: ' + (error as Error).message });
  }
};
