import { Response } from "express";
import { RequestWithBody } from "../interfaces/interface";
import { PostDocument, PostModel } from "../models/postModel";
import { UserModel } from "../models/userModel";

const postHandler = async (req: RequestWithBody, res: Response) => {
    const { content } = req.body;
    if (!content) {
        res.status(400).send("Content cannot be empty");
    }
    // create a new post
    const postData = {
        content,
        postedBy: req.session.user._id,
    } as any;
    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }
    const newPost = await PostModel.create(postData);
    //populate the postedBy field
    const Post = await newPost.populate("postedBy");
    res.status(201).send(Post);
}

const getpostHandler = async (req: RequestWithBody, res: Response) => {
    let posts = await PostModel.find({}).populate("postedBy").populate("retweetData").populate("replyTo").sort({ createdAt: -1 });
    posts = await PostModel.populate(posts, { path: "replyTo.postedBy" });
    posts = await PostModel.populate(posts, { path: "retweetData.postedBy" });
    res.status(200).send(posts);
}
const getpostByIdHandler = async (req: RequestWithBody, res: Response) => {
    const postId = req.params.id;
    if(postId === undefined) { console.log(postId);res.status(400).send("Post id is undefined"); return;}
    let postData = await PostModel.findById(postId)
    .populate("postedBy")
    .populate("retweetData")
    .populate('replyTo')
    .sort({ createdAt: -1 }) as any;
    postData = await UserModel.populate(postData, { path: "retweetData.postedBy" });
    postData = await UserModel.populate(postData, { path: "replyTo.postedBy" });
    let results = {
        postData,
    } as any;
    if (postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }
    let replies = await PostModel.find({ replyTo: postId })
        .populate("postedBy")
        .populate("retweetData")
        .populate('replyTo')
        .sort({ createdAt: -1 }) as any;
    replies = await UserModel.populate(replies, { path: "replyTo.postedBy" });
    replies = await UserModel.populate(replies, { path: "retweetData.postedBy" });
    results.replies = replies;
    res.status(200).send(results);
}

const likePostHandler = async (req: RequestWithBody, res: Response) => {
    const postId = req.params.postid;
    const userId = req.session.user._id;
    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    if (!isLiked) {
        console.log("liked");
    } else console.log("unliked");
    req.session.user = await UserModel.findByIdAndUpdate(userId, isLiked ? {
        $pull: { likes: postId }
    } : {
        $addToSet: { likes: postId }
    }, { new: true });

    const post = await PostModel.findByIdAndUpdate(postId, isLiked ? {
        $pull: { likes: userId }
    } : {
        $addToSet: { likes: userId }
    }, { new: true });
    res.status(200).send(post);
}

const getPostPageHandler = async (req: RequestWithBody, res: Response) => {
    const postId = req.params.id;
    const postData = await PostModel.findById(postId).populate("postedBy").populate("retweetData").populate("replyTo");
    console.log("in route");
    const payload = {
        pageTitle: 'View Post',
        user: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId
    }
    res.status(200).render('postPage', payload);
}

const retweetHandler = async (req: RequestWithBody, res: Response) => {
    const postId = req.params.postid;
    const userId = req.session.user._id;

    // try and delete retweet
    const deletedPost = await PostModel.findOneAndDelete({ postedBy: userId, retweetData: postId });

    const option = deletedPost ? '$pull' : '$addToSet';

    let repost = deletedPost;

    if (repost === null) {
        repost = await PostModel.create({ postedBy: userId, retweetData: postId });
        console.log("repost", repost);
        await PostModel.findByIdAndUpdate(postId, { $addToSet: { retweetUsers: userId } });
    }

    req.session.user = await UserModel.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true });

    const post = await PostModel.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true });
    res.status(200).send(post);
}

const deletePostHandler = async (req: RequestWithBody, res: Response) => {
    const postId = req.params.id;
    const userId = req.session.user._id;
    // delete post
    const post = await PostModel.findById(postId) as any;
    if(userId !== post.postedBy.toString()) {
        res.status(403).send("Unauthorized");
        return;
    }
    // delete replies
    // delete reply of reply
    await PostModel.findByIdAndDelete(postId);
    res.status(202).send("Post deleted successfully");
}
export { postHandler, getpostHandler, likePostHandler, retweetHandler, getpostByIdHandler, getPostPageHandler, deletePostHandler }