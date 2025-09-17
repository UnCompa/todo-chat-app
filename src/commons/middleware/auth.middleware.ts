import { auth } from "@auth/auth.js";
import { type Session } from "better-auth";
import { Organization } from "better-auth/plugins";
import { NextFunction, Request, Response } from "express";

export interface SessionWithOrganization extends Session {
  activeOrganizationId?: string | null | undefined
}

type CustomOrganization = Omit<Organization, 'slug'> & {
  slug: string | null;
};


export interface AuthenticatedRequest extends Request {}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Better Auth extrae el token de cookies/headers automáticamente
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    const sessionData = session;
    console.info(sessionData);
    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Agregar user y session al request
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication" });
  }
};