import { Router } from "express";
import { deletePostHandler, getpostByIdHandler, getpostHandler, likePostHandler, postHandler, retweetHandler } from "../controllers/post.controller";
import verifySession from "../middlewares/session";

const router = Router();
router.post("/", verifySession as any, postHandler as any);
router.get("/", getpostHandler as any);
router.get("/:id",verifySession as any, getpostByIdHandler as any);
router.delete("/:id", verifySession as any, deletePostHandler as any);
router.put("/:postid/like", verifySession as any, likePostHandler as any);
router.post("/:postid/retweet", verifySession as any, retweetHandler as any);
export default router;