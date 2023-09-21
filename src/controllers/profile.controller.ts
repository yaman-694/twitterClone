import { Response } from "express";
import { RequestWithBody } from "../interfaces/interface";
import { UserDocument, UserModel } from "../models/userModel";

const ProfileHandler = async (req: RequestWithBody, res: Response) => {
    const payload = {
        pageTitle: req.session.user.username,
        user: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user,
    }
    res.status(200).render("profilePage", payload);
}

const ProfileByNameHandler = async (req: RequestWithBody, res: Response) => {
    let profileUser: UserDocument | null = null;
    profileUser = await UserModel.findOne({ username: req.params.username }) as UserDocument;
    console.log("profileUser", profileUser)
    if(profileUser===null) {
        profileUser = await UserModel.findById(req.params.username) as UserDocument;
    }
    const payload = {
        pageTitle: profileUser===null ? 'User Not Found' : profileUser.username,
        user: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser
    }
    res.status(200).render("profilePage", payload);
}

export { ProfileHandler, ProfileByNameHandler };