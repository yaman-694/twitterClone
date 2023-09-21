import { Router } from "express";
import { getPostPageHandler } from "../controllers/post.controller";
import verifySession from "../middlewares/session";

const router = Router();

router.get("/:id", verifySession as any,getPostPageHandler as any);

export default router;