import { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { TokenInfoSchema } from "./TokenInfoSchema";

export const UserSchema = new Schema<IUser>({
    email: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: String, required: false },
    telegramId: { type: String, required: false },
    token: { type: TokenInfoSchema, required: false }
});
