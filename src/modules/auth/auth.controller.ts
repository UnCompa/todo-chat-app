import { auth } from "@auth/auth.js";
import { toNodeHandler } from "better-auth/node";
import { Router } from "express";

const router = Router();

router.all("/*path", toNodeHandler(auth));

export const authController = router;
