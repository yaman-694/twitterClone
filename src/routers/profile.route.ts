import { Router } from "express";
import loginMiddleware from "../middlewares/session";
import { ProfileByNameHandler, ProfileHandler } from "../controllers/profile.controller";

const router = Router();
router.get("/", loginMiddleware as any, ProfileHandler as any );
router.get("/:username", loginMiddleware as any, ProfileByNameHandler as any );

export default router;