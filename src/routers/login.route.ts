import { Router } from "express";
import { loginHandler } from "../controllers/login.controller";

const router = Router();

router.get("/", (req, res) => {
    const payload = {
        pageTitle: "Login page",
    }
    console.log("login route");
    res.status(200).render("login", payload);
});

router.post("/", loginHandler as any);

export default router;