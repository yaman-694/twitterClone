import { Request, Response } from "express";
import { authSchema } from "../utils/authValidators";
import { UserModel } from "../models/userModel";
import { RequestWithBody } from "../interfaces/interface";

const registerHandler = async (req: RequestWithBody, res: Response) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
    const { error } = authSchema.validate({ firstName, lastName, username, email, password, confirmPassword });
    if (error) {
        const message = error.details[0].message;
        res.status(400).render("register", { message, firstName, lastName, username, email, password, confirmPassword });
        return;
    }
    // find if email or username already exists
    const userObj = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (userObj) {
        res.status(400).render("register", { message: "User already exists", firstName, lastName, username, email });
        return;
    }

    // create user
    const user = new UserModel({ firstName, lastName, username, email, password });
    await user.save();
    req.session.user = user;
    // const use
    res.status(200).redirect("/");
}

export {registerHandler};