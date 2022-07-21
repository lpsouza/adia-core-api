import { model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { UserSchema } from "../schemas/UserSchema";

export const User = model<IUser>("users", UserSchema);
