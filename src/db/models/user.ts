import { Schema, model, Document } from "mongoose";

export enum UserRole {
  OWNER = "owner",
  USER = "user",
}

interface IUser {
  name: string;
  contactNumber: string;
  email: string;
  address: string;
  role: UserRole;
}

type IUserDocument = IUser & Document;

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    address: { type: String },
    role: { type: String, required: true, enum: Object.values(UserRole) },
  },
  { timestamps: true },
);

const User = model<IUserDocument>("User", userSchema);

export default User;
