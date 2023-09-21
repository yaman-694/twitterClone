import mongoose, { Document, Schema } from 'mongoose';

export interface PostDocument extends Document {
    content: string;
    postedBy: any;
    pinned: boolean;
    likes: any[];
    retweetUsers: any[];
    retweetData: any;
    replyTo: any;
}

const PostSchema = new Schema<PostDocument>({
    content: { type: String },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

// Create and export the BlogPost model
export const PostModel = mongoose.model<PostDocument>('Post', PostSchema);
