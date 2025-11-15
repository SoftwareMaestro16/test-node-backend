import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDay: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      default: () => Math.floor(10000000 + Math.random() * 912345),
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: false },

    birthDay: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user"],
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
