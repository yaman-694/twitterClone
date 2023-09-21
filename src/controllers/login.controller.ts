import { Response } from "express";
import { authSchema, loginSchema } from "../utils/authValidators";
import { UserDocument, UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import { RequestWithBody } from "../interfaces/interface";

const loginHandler = async (req: RequestWithBody, res: Response) => {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password});
    if (error) {
        const message = error.details[0].message;
        res.status(400).render("login", { message, email });
        return;
    }
    // find if email or username already exists
    let user: UserDocument | null;
    user = await UserModel.findOne({ $or: [{email}, {username: email}]}) as UserDocument;
    console.log(user, email)
    if (
        user !== null &&
        (await bcrypt.compare(password as string, user.password as string))
    ) {
        req.session.user = user;
        res.status(400).redirect("/");
        return;
    } else {
        res.status(400).render("login", { message: "Invalid Credentials", email });
        return;
    }
}

export {
    loginHandler
};