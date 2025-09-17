import { NextFunction, Request, Response } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(403).json({ error: 'Role information missing' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// Roles específicos como funciones
export const requireOwner = requireRole(['owner']);
export const requireAdmin = requireRole(['owner', 'admin']);
export const requireEditor = requireRole(['owner', 'admin', 'editor']);
export const requireMember = requireRole(['owner', 'admin', 'editor', 'member']);
