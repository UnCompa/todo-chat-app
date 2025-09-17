import { Request, Response } from "express";
import { ResponseBuilder } from "src/commons/utils/response.js";
import { addNewProjectDto } from "./dto/add-new-project.dto.js";
import { ProjectService } from "./projects.service.js";

export const newProject = async (req: Request, res: Response) => {
  const parseResult = addNewProjectDto.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: parseResult.error.format(),
    });
  }

  const { name, description } = parseResult.data;
  if (req.organization != null) {
    await ProjectService.addNewProject({ name, description, organizationId: req.organization.id });
  }
  return res.status(201).json(new ResponseBuilder().setStatus(201).setMessage("Project created successfully"));
}

export default {
  newProject
}