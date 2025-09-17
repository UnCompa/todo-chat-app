import { Organization, Project } from "../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
      session?: {
        id: string;
        userId: string;
        activeOrganizationId?: string | null | undefined
      };
      organization?: Organization;
      project?: Project;
      userRole?: string;
      log: Logger;
    }
  }
}