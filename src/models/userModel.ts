import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
// Define the User schema
export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  profilePic: string;
  email: string;
  password: string;
  userId: string;
  likes: any[];
  retweets: any[];
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true, trim: true, min: 4 },
  lastName: { type: String, required: true, trim: true, min: 4 },
  username: { type: String, required: true, trim: true, min: 4, unique: true },
  profilePic: { type: String, default: '/images/profilePic.png' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  retweets: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

userSchema.pre('save', async function(this: UserDocument, next: () => void) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});
// Create and export the User model
export const UserModel = mongoose.model<UserDocument>('User', userSchema);
