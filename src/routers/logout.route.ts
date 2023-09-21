import { Response, Router } from "express";
import { RequestWithBody } from "../interfaces/interface";

const router = Router();
const logoutHandler = (req: RequestWithBody, res: Response) => {
    if(req.session){
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }
}
router.get("/",  logoutHandler as any);


export default router;