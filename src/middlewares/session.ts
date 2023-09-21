import { NextFunction, Request, Response } from "express";
import { RequestWithBody } from "../interfaces/interface";

const loginMiddleware = async (req: RequestWithBody, res: Response, next: NextFunction) => {
    if(req.session && req.session.user) {
        console.log('login 1 middleware')
        next();
    }
    else {
        console.log('login 2 middleware')
        res.redirect("/login");
    }
}

export default loginMiddleware;