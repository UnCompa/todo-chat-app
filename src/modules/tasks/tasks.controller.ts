import { Request, Response } from "express";
import { ResponseBuilder } from "src/commons/utils/response.js";
import { TasksService } from "./tasks.service.js";
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    req.log.info('Fetching tasks');
    const tasks = await TasksService.getAllTasks()
    res.status(200).json(new ResponseBuilder()
        .setMessage("Tareas traidas correctamente")
        .setData(tasks)
        .build());
}