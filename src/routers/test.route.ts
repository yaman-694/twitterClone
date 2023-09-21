import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    const payload = {
        pageTitle: "New title",
    }
    res.status(200).render("home", payload);
});

export default router;