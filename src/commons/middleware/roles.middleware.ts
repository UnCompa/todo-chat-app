import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware.js";

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(403).json({ error: "Role information missing" });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${allowedRoles.join(", ")}`
      });
    }

    next();
  };
};

// Roles específicos como funciones
export const requireOwner = requireRole(["owner"]);
export const requireAdmin = requireRole(["admin"]);
export const requireEditor = requireRole(["admin", "editor"]);
export const requireMember = requireRole(["admin", "editor", "member"]);