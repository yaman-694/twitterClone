import { Request, Response, Router } from "express";
import { registerHandler } from "../controllers/register.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const payload = {
        pageTitle: "Register page",
    }
    res.status(200).render("register", payload);
});
router.post("/", registerHandler);

export default router;