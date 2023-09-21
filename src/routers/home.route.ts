import { Response, Router } from "express";
import loginMiddleware from "../middlewares/session";
import { RequestWithBody } from "../interfaces/interface";

const router = Router();
const homeHandler = async (req: RequestWithBody, res: Response) => {
    const payload = {
        pageTitle: "Home",
        user: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }
    res.status(200).render("home", payload);
}

router.get("/", loginMiddleware as any,homeHandler as any );

export default router;